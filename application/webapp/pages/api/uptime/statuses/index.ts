import { NextApiRequest, NextApiResponse } from "next";
import { Session } from "next-auth";
import { getSession } from "next-auth/client";
import { ddbClient, env } from "../../../../src/common/server-utils";
import { getStatusesForMultipleMonitors } from "../../../../src/modules/uptime/status-db";

async function getHandler(
  req: NextApiRequest,
  res: NextApiResponse,
  session: Session
) {
  try {
    const { id: ids, since } = req.query;
    const sinceAsNumber = Number.parseInt(since as string);
    const idsAsList = typeof ids === "string" ? [ids] : ids;
    if (!since || !ids || !sinceAsNumber || !idsAsList) {
      res.status(400);
      return;
    }
    const statuses = await getStatusesForMultipleMonitors(
      ddbClient,
      idsAsList,
      env.UPTIME_MONITOR_STATUS_TABLE_NAME,
      sinceAsNumber
    );
    res.status(200);
    res.json(statuses);
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
