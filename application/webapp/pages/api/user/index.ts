import { NextApiRequest, NextApiResponse } from "next";
import { Session } from "next-auth";
import { getSession } from "next-auth/react";
import { Team } from "utils";
import { ddbClient, env } from "../../../src/common/server-utils";
import { PLAN_PRODUCT_IDS } from "../../../src/modules/billing/plans";
import { deleteAllProjectsAndAssociatedAssetsForOwner } from "../../../src/modules/projects/server/db";
import { getTeamById, userIsAdmin } from "../../../src/modules/teams/server/db";
import {
  deleteUserById,
  getServicePlanProductIdForUser,
  getUserById,
} from "../../../src/modules/user/user-db";

async function getHandler(
  req: NextApiRequest,
  res: NextApiResponse,
  session: Session
) {
  try {
    const userId = session.uid as string;
    const user = await getUserById(ddbClient, env.USER_TABLE_NAME, userId);
    if (user) {
      if (user.slack_installations) {
        user.slack_installations.forEach((installation) => {
          if (installation.incomingWebhook)
            installation.incomingWebhook.url = "--redacted--";
          if (installation.bot) installation.bot.token = "--redacted--";
        });
      }
      res.status(200);
      res.json(user);
      return;
    }
    throw new Error(`no user with id: ${userId}`);
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
    const productId = await getServicePlanProductIdForUser(
      ddbClient,
      env.USER_TABLE_NAME,
      userId
    );

    const user = await getUserById(ddbClient, env.USER_TABLE_NAME, userId);

    if (!user) {
      res.status(401);
      return;
    }

    // Cannot delete if user is on a paid plan or has teams
    if (productId !== PLAN_PRODUCT_IDS.STARTER) {
    }

    if (user.teams && user.teams.length > 0) {
      // find teams where user is admin
      const teamFetches = [];
      for (let teamId of user.teams) {
        teamFetches.push(getTeamById(teamId));
      }

      const teams = (await Promise.all(teamFetches)).filter(
        (t) => t !== undefined
      ) as Team[];
      for (let team of teams) {
        if (userIsAdmin(userId, team)) {
          res.status(403);
          return;
        }
      }
    }

    const projectsDeleted = await deleteAllProjectsAndAssociatedAssetsForOwner(
      ddbClient,
      env.PROJECTS_TABLE_NAME,
      env.UPTIME_MONITOR_TABLE_NAME,
      env.UPTIME_MONITOR_TABLE_PID_GSI_NAME,
      userId
    );

    const deleted = await deleteUserById(
      ddbClient,
      env.USER_TABLE_NAME,
      userId
    );
    if (deleted) {
      res.status(200);
      return;
    } else {
      throw new Error("Failed to delete user from DB");
    }
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
      case "GET":
        await getHandler(req, res, session);
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
