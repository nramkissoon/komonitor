import { NextApiRequest, NextApiResponse } from "next";
import { Session } from "next-auth";
import { getSession } from "next-auth/react";
import { ddbClient, env } from "../../../src/common/server-utils";
import {
  getTeamById,
  removeTeamMember,
  userCanEdit,
  userIsAdmin,
} from "../../../src/modules/teams/server/db";
import { getUserById } from "../../../src/modules/user/user-db";

//TODO update?

async function createHandler(
  req: NextApiRequest,
  res: NextApiResponse,
  session: Session
) {
  try {
    const userId = session.uid as string;

    const { inviteCode } = req.query;

    res.status(200);
    return;
  } catch (err) {
    res.status(500);
    return;
  }
}

async function deleteHandler(
  req: NextApiRequest,
  res: NextApiResponse,
  session: Session
) {
  try {
    const userId = session.uid as string;

    const { teamId } = req.query;
    const { userToDelete } = req.body;

    const team = await getTeamById(teamId as string);

    if (!team) {
      res.status(400);
      return;
    }

    // verify user is admin or removing self

    if (!userIsAdmin(userId, team) && userToDelete !== userId) {
      res.status(403);
      return;
    }

    // admin cannot remove self
    if (userIsAdmin(userId, team) && userId === userToDelete) {
      res.status(400);
      return;
    }

    if (!userCanEdit(userId, team)) {
      res.status(403);
      return;
    }

    // delete user
    const user = await getUserById(
      ddbClient,
      env.USER_TABLE_NAME,
      userToDelete as string
    );

    if (!user) {
      res.status(400);
      return;
    }
    const removed = await removeTeamMember(user, team);

    if (!removed) {
      throw new Error("removal failed");
    }

    res.status(200);
    return;
  } catch (err) {
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
    res.redirect("/auth/signin");
  }
  res.end();
}
