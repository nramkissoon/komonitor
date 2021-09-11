import { NextApiRequest, NextApiResponse } from "next";
import { Session } from "next-auth";
import { getSession } from "next-auth/client";
import { ddbClient, env } from "../../../../src/common/server-utils";
import {
  deleteMonitor,
  getMonitorsForUser,
} from "../../../../src/modules/uptime/monitor-db";

async function getHandler(
  req: NextApiRequest,
  res: NextApiResponse,
  session: Session
) {
  try {
    const userId = session.uid as string;
    const monitors = await getMonitorsForUser(
      ddbClient,
      env.UPTIME_MONITOR_TABLE_NAME,
      userId
    );
    res.status(200);
    res.json(monitors);
  } catch (err) {
    res.status(500);
  }
}

async function updateHandler(
  req: NextApiRequest,
  res: NextApiResponse,
  session: Session
) {}

async function createHandler(
  req: NextApiRequest,
  res: NextApiResponse,
  session: Session
) {
  // TODO get number of monitors belonging to user
  // TODO get allowed number of monitors for user and compare
}

async function deleteHandler(
  req: NextApiRequest,
  res: NextApiResponse,
  session: Session
) {
  try {
    const { monitorId } = req.body;
    if (!monitorId) {
      res.status(400);
      return;
    }

    const userId = session.uid as string;
    await deleteMonitor(
      ddbClient,
      env.UPTIME_MONITOR_TABLE_NAME,
      monitorId,
      userId
    );
    res.status(200);
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
      case "POST":
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
