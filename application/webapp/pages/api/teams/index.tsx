import { NextApiRequest, NextApiResponse } from "next";
import { Session } from "next-auth";
import { getSession } from "next-auth/react";
import {
  createTeam,
  getTeamById,
  userIsMember,
} from "../../../src/modules/teams/server/db";
import { teamIdIsAvailable } from "../../../src/modules/teams/server/validation";

async function getHandler(
  req: NextApiRequest,
  res: NextApiResponse,
  session: Session
) {
  try {
    const { teamId } = req.query;

    if (!teamId || teamId === "") {
      res.json(undefined);
      return;
    }

    let userId = session.uid as string;

    const team = await getTeamById(teamId as string);

    if (!team) {
      res.status(404);
      return;
    }

    if (!userIsMember(userId, team)) {
      res.status(403);
      return;
    }

    res.status(200);
    res.json(team);
  } catch (err) {
    console.log(err);
    res.status(500);
  }
}

//TODO update?

async function createHandler(
  req: NextApiRequest,
  res: NextApiResponse,
  session: Session
) {
  try {
    const userId = session.uid as string;

    const { teamId } = req.body;

    if (!teamIdIsAvailable(teamId)) {
      res.status(400);
      return;
    }

    const created = await createTeam(teamId, userId);

    if (created) {
      res.status(200);
      return;
    }
    res.status(500);
    return;
  } catch (err) {
    res.status(500);
    return;
  }
}

// TODO delete handler?

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
      case "POST":
        await createHandler(req, res, session);
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
