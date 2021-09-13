import { NextApiRequest, NextApiResponse } from "next";
import { Session } from "next-auth";
import { getSession } from "next-auth/client";
import { ddbClient, env } from "../../../../src/common/server-utils";
import { getUptimeMonitorAllowanceFromProductId } from "../../../../src/modules/billing/plans";
import {
  createMonitor,
  deleteMonitor,
  getMonitorsForUser,
} from "../../../../src/modules/uptime/monitor-db";
import { createNewMonitorFromCore } from "../../../../src/modules/uptime/utils";
import { isValidCoreUptimeMonitor } from "../../../../src/modules/uptime/validation";
import { getServicePlanProductIdForUser } from "../../../../src/modules/user/user-db";

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
) {
  // TODO verify that the monitor id belongs to the user if update
}

async function createHandler(
  req: NextApiRequest,
  res: NextApiResponse,
  session: Session
) {
  const { monitor } = req.body;
  if (!monitor || !isValidCoreUptimeMonitor(monitor)) {
    res.status(400);
    return;
  }

  try {
    // check if user is allowed to create a new monitor
    const userId = session.uid as string;
    const product_id = await getServicePlanProductIdForUser(
      ddbClient,
      env.USER_TABLE_NAME,
      session.uid as string
    );
    const allowance = getUptimeMonitorAllowanceFromProductId(product_id);
    const currentMonitorsTotal = (
      await getMonitorsForUser(ddbClient, env.UPTIME_MONITOR_TABLE_NAME, userId)
    ).length;

    if (allowance >= currentMonitorsTotal) {
      res.status(403);
      return;
    }

    // user is allowed to create monitor
    const newMonitor = createNewMonitorFromCore(monitor, userId);
    const created = await createMonitor(
      ddbClient,
      env.UPTIME_MONITOR_TABLE_NAME,
      newMonitor
    );
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

async function deleteHandler(
  req: NextApiRequest,
  res: NextApiResponse,
  session: Session
) {
  try {
    const { monitorId } = req.query;
    if (!monitorId) {
      res.status(400);
      return;
    }

    const userId = session.uid as string;
    const deleted = await deleteMonitor(
      ddbClient,
      env.UPTIME_MONITOR_TABLE_NAME,
      monitorId as string,
      userId
    );
    deleted ? res.status(200) : res.status(500);
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
        await createHandler(req, res, session);
        break;
      case "DELETE":
        await deleteHandler(req, res, session);
        break;
      case "PATCH":
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
