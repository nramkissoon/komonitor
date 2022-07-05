import { NextApiRequest, NextApiResponse } from "next";
import { Session } from "next-auth";
import { getSession } from "next-auth/react";
import { ddbClient, env, stripeClient } from "../../../src/common/server-utils";
import { PLAN_PRODUCT_IDS } from "../../../src/modules/billing/plans";
import {
  getTeamById,
  userIsMember,
} from "../../../src/modules/teams/server/db";
import {
  getOrCreateStripeCustomerIdForUserId,
  getServicePlanProductIdForUser,
} from "../../../src/modules/user/user-db";

const getOwnerIdAndTeam = async (req: NextApiRequest, session: Session) => {
  const userId = session.uid as string;
  const { teamId } = req.query;

  // if team is defined it should be taken over userId since we are working in a team
  const ownerId = teamId ? (teamId as string) : userId;

  if (ownerId === teamId) {
    // check if userId in team members
    // throw if not valid
    const team = await getTeamById(teamId);

    if (!team) throw new Error(`team: ${teamId} not found in db`);
    if (!userIsMember(userId, team)) {
      throw new Error(`user is not member of team`);
    }
    return { ownerId, team };
  }
  return { ownerId };
};

async function postHandler(
  req: NextApiRequest,
  res: NextApiResponse,
  session: Session
) {
  try {
    const userId = session.uid as string;
    const ownerIdTeam = await getOwnerIdAndTeam(req, session);
    const ownerId = ownerIdTeam.ownerId;

    let stripeCustomerId;
    let productId;

    if (ownerIdTeam.team) {
      const teamCustomerId = ownerIdTeam.team.customer_id;
      const userCustomerId: string | undefined =
        await getOrCreateStripeCustomerIdForUserId(
          ddbClient,
          env.USER_TABLE_NAME,
          userId
        );

      // only the admin or customerid is allowed to user portal
      if (teamCustomerId !== userCustomerId) {
        res.status(403);
        return;
      }

      stripeCustomerId = teamCustomerId;
      productId = ownerIdTeam.team.product_id;
    } else {
      stripeCustomerId = await getOrCreateStripeCustomerIdForUserId(
        ddbClient,
        env.USER_TABLE_NAME,
        userId
      );
      productId = await getServicePlanProductIdForUser(
        ddbClient,
        env.USER_TABLE_NAME,
        userId
      );
    }

    //redirect to pricing page if free plan
    if (productId === PLAN_PRODUCT_IDS.STARTER) {
      res.status(200);
      res.json({ url: env.BASE_URL + "pricing" });
      return;
    }

    if (stripeCustomerId === undefined)
      throw new Error("undefined Stripe Customer Id");

    const returnUrl = ownerIdTeam.team
      ? `teams/${ownerIdTeam.team.id}/settings?tab=1`
      : "app/settings?tab=1";

    const portSession = await stripeClient.billingPortal.sessions.create({
      customer: stripeCustomerId,
      return_url: env.BASE_URL + returnUrl,
    });

    res.json({ url: portSession.url as string });
  } catch (err) {
    console.log(err);
    res.status(500);
    return;
  }
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await getSession({ req });
  if (session) {
    switch (req.method) {
      case "POST":
        await postHandler(req, res, session);
        break;
      default:
        res.status(405);
        break;
    }
  } else {
    res.status(401);
  }
  res.end();
}
