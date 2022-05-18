import { NextApiRequest, NextApiResponse } from "next";
import { Session } from "next-auth";
import { getSession } from "next-auth/react";
import { env } from "../../../../src/common/server-utils";
import { slackInstaller } from "../../../../src/modules/integrations/slack/server";
import {
  getTeamById,
  userCanEdit,
} from "../../../../src/modules/teams/server/db";

const createOwnerIdCompoundKey = (id: string, isTeam: boolean) => {
  if (isTeam) return "TEAM#" + id;
  return "USER#" + id;
};

async function getHandler(
  req: NextApiRequest,
  res: NextApiResponse,
  session: Session
) {
  try {
    const userId = session.uid as string;
    const { teamId } = req.query;
    const id = teamId ? (teamId as string) : userId;

    // verify user is member of team if specified
    if (teamId) {
      const team = await getTeamById(teamId as string);
      if (!team) {
        res.status(400);
        return;
      }
      if (!userCanEdit(userId, team)) {
        res.status(403);
        return;
      }
    }

    const url = await slackInstaller.generateInstallUrl(
      {
        scopes: ["incoming-webhook", "team:read", "channels:read"],
        redirectUri: env.SLACK_REDIRECT,
        // pass in compound key as metadata in order to add integ to db in callback
        // compound key needed to specify user vs team
        metadata: createOwnerIdCompoundKey(id, teamId !== undefined),
      },
      true
    );
    res.status(200);
    res.json({ url });
  } catch (err) {
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
      default:
        res.status(405);
        break;
    }
  } else {
    res.status(401);
  }
  res.end();
}
