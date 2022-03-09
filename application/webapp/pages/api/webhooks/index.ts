import crypto from "crypto";
import { NextApiRequest, NextApiResponse } from "next";
import { Session } from "next-auth";
import { getSession } from "next-auth/react";
import { WebhookSecret } from "utils";
import { ddbClient, env } from "../../../src/common/server-utils";
import { PLAN_PRODUCT_IDS } from "../../../src/modules/billing/plans";
import {
  deleteTeamWebhook,
  getTeamById,
  setTeamWebhookSecret,
  userCanEdit,
  userIsMember,
} from "../../../src/modules/teams/server/db";
import {
  deleteUserWebhook,
  getUserById,
  setUserWebhookSecret,
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

async function createHandler(
  req: NextApiRequest,
  res: NextApiResponse,
  session: Session
) {
  try {
    const userId = session.uid as string;
    const ownerIdTeam = await getOwnerIdAndTeam(req, session);
    const ownerId = ownerIdTeam.ownerId;
    const chars =
      "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz".repeat(
        5
      );
    const rand = crypto.randomBytes(64);
    let token = "wh_";
    for (let i = 0; i < rand.length; i++) {
      let decimal = rand[i];
      token += chars[decimal];
    }
    const createdAt = new Date().getTime();

    const secret: WebhookSecret = {
      value: token,
      created_at: createdAt,
    };

    if (ownerIdTeam.team) {
      if (ownerIdTeam.team.product_id === PLAN_PRODUCT_IDS.STARTER) {
        // webhooks not available for free plans
        res.status(403);
        return;
      }
      if (!userCanEdit(userId, ownerIdTeam.team)) {
        // no permission
        res.status(403);
        return;
      }
      await setTeamWebhookSecret(ownerIdTeam.team.id, secret);
    } else {
      const user = await getUserById(ddbClient, env.USER_TABLE_NAME, userId);

      if (!user) {
        res.status(401);
        return;
      }

      if (user?.product_id === PLAN_PRODUCT_IDS.STARTER) {
        // webhooks not available for free plans
        res.status(403);
        return;
      }

      await setUserWebhookSecret(userId, secret);
    }

    res.status(200);
    return;
  } catch (err) {
    console.error(err);
    res.status(500);
  }
}

async function deleteHandler(
  req: NextApiRequest,
  res: NextApiResponse,
  session: Session
) {
  try {
    const userId = session.uid as string;

    const ownerIdTeam = await getOwnerIdAndTeam(req, session);
    const ownerId = ownerIdTeam.ownerId;

    // TODO this is kinda weird because what if the user maliciously does not add teamId to req, their own webhook gets deleted

    if (ownerIdTeam.team) {
      if (!userCanEdit(userId, ownerIdTeam.team)) {
        // no permission
        res.status(403);
        return;
      }
      await deleteTeamWebhook(ownerIdTeam.team.id);
    } else {
      const user = await getUserById(ddbClient, env.USER_TABLE_NAME, userId);
      if (!user) {
        res.status(401);
        return;
      }
      await deleteUserWebhook(userId);
    }

    res.status(200);
    return;
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
        await createHandler(req, res, session);
        break;
      case "DELETE":
        await deleteHandler(req, res, session);
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
