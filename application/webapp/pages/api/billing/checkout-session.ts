import { NextApiRequest, NextApiResponse } from "next";
import { Session } from "next-auth";
import { getSession } from "next-auth/react";
import { ddbClient, env, stripeClient } from "../../../src/common/server-utils";
import { getTeamById, userIsAdmin } from "../../../src/modules/teams/server/db";
import { getOrCreateStripeCustomerIdForUserId } from "../../../src/modules/user/user-db";

async function postHandler(
  req: NextApiRequest,
  res: NextApiResponse,
  session: Session
) {
  try {
    // This API is called when a user wishes to purchase a team subscription plan
    const userId = session.uid as string;
    const stripeCustomerId: string | undefined =
      await getOrCreateStripeCustomerIdForUserId(
        ddbClient,
        env.USER_TABLE_NAME,
        userId
      );

    if (stripeCustomerId === undefined)
      throw new Error("undefined Stripe Customer Id");

    const { priceId, teamId } = req.body;

    const validPrice = await stripeClient.prices.retrieve(priceId);

    if (!validPrice.active) {
      res.status(400);
      return;
    }

    // verify userId is admin of this team
    const team = await getTeamById(teamId);

    if (team === undefined) {
      res.status(400);
      return;
    }

    if (!userIsAdmin(userId, team)) {
      res.status(403);
      return;
    }

    const stripeSession = await stripeClient.checkout.sessions.create({
      billing_address_collection: "auto",
      payment_method_types: ["card"],
      line_items: [
        {
          price: validPrice.id,
          quantity: 1,
        },
      ],
      mode: "subscription",
      subscription_data: {
        trial_period_days: 14,
        metadata: {
          team_id: teamId,
        },
      },
      success_url: env.BASE_URL + "/teams/" + teamId,
      cancel_url: env.BASE_URL + "/app?checkout_canceled=true",
      customer: stripeCustomerId,
      client_reference_id: userId,
      metadata: {
        team_id: teamId,
      },
    });

    res.json({ url: stripeSession.url as string });
  } catch (err) {
    console.error(err);
    res.status(500);
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
