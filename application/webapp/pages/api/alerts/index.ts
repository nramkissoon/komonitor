import { NextApiRequest, NextApiResponse } from "next";
import { Session } from "next-auth";
import { getSession } from "next-auth/client";
import { ddbClient, env } from "../../../src/common/server-utils";
import {
    deleteAlert,
    getAlertsForUser
} from "../../../src/modules/alerts/alert-db";
import { getMonitorsForUser } from "../../../src/modules/uptime/monitor-db";

async function getHandler(
  req: NextApiRequest,
  res: NextApiResponse,
  session: Session
) {
  try {
    const userId = session.uid as string;
    const alerts = await getAlertsForUser(
      ddbClient,
      env.ALERT_TABLE_NAME,
      userId
    );
    res.status(200);
    res.json(alerts);
  } catch (err) {
    res.status(500);
  }
}

async function createHandler(
  req: NextApiRequest,
  res: NextApiResponse,
  session: Session
) {}

async function deleteHandler(
  req: NextApiRequest,
  res: NextApiResponse,
  session: Session
) {
  try {
    const { alertId } = req.query;
    if (!alertId) {
      res.status(400);
      return;
    }

    const userId = session.uid as string;
    // check if alert is attached to any monitors
    // TODO check for errors in fetching monitors
    const monitors = await getMonitorsForUser(
        ddbClient,
        env.UPTIME_MONITOR_TABLE_NAME,
        userId
      );
    const attachedMonitors: string[] = []
    for (let monitor of monitors) {
        if (monitor.alert_id === (alertId as string)) {
            attachedMonitors.push(monitor.name)
        }
    }

    if (attachedMonitors.length > 0) {
        res.status(403)
        res.json(attachedMonitors)
        return
    }

    const deleted = await deleteAlert(
      ddbClient,
      env.UPTIME_MONITOR_TABLE_NAME,
      alertId as string,
      userId
    );
    deleted ? res.status(200) : res.status(500);
  } catch (err) {
    res.status(500);
  }
  
}

async function updateHandler(
  req: NextApiRequest,
  res: NextApiResponse,
  session: Session
) {}

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
      case "DELETE":
        await deleteHandler(req, res, session);
        break;
      case "PUT":
        await updateHandler(req, res, session);
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
