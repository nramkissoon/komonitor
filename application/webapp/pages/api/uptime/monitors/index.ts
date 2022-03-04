import { NextApiRequest, NextApiResponse } from "next";
import { Session } from "next-auth";
import { getSession } from "next-auth/react";
import { Team, UptimeMonitor } from "utils";
import { ddbClient, env } from "../../../../src/common/server-utils";
import {
  getPreviousAlertInvocationForMonitor,
  setInvocationOngoingToFalse,
} from "../../../../src/modules/alerts/invocations-db";
import {
  getUptimeMonitorAllowanceFromProductId,
  PLAN_PRODUCT_IDS,
} from "../../../../src/modules/billing/plans";
import {
  getTeamById,
  userIsMember,
} from "../../../../src/modules/teams/server/db";
import {
  deleteMonitor,
  getMonitorForUserByMonitorId,
  getMonitorsForMultipleProjectsForOwner,
  getMonitorsForOwner,
  putMonitor,
} from "../../../../src/modules/uptime/monitor-db";
import {
  createNewMonitorFromCore,
  createUpdatedMonitor,
} from "../../../../src/modules/uptime/utils";
import {
  isValidCoreUptimeMonitor,
  isValidUptimeMonitor,
} from "../../../../src/modules/uptime/validation";
import { getUserById } from "../../../../src/modules/user/user-db";

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

const getProductPlanIdAndValidSubscription = async (
  ownerId: string,
  team?: Team
): Promise<{ productId: string | null; valid: boolean }> => {
  if (team) {
    if (!team.product_id) {
      return {
        productId: null,
        valid: false,
      };
    }
    return {
      productId: team.product_id,
      valid:
        team.subscription_status === "active" ||
        team.subscription_status === "trialing",
    };
  } else {
    const user = await getUserById(ddbClient, env.USER_TABLE_NAME, ownerId);

    if (!user) return { valid: false, productId: null };

    const productId = user?.product_id ?? PLAN_PRODUCT_IDS.STARTER;

    if (productId === PLAN_PRODUCT_IDS.STARTER) {
      return {
        productId,
        valid: true,
      };
    } else {
      return {
        productId,
        valid:
          user.subscription_status === "active" ||
          user.subscription_status === "trialing",
      };
    }
  }
};

async function getHandler(
  req: NextApiRequest,
  res: NextApiResponse,
  session: Session
) {
  try {
    const { projectId: projectIds } = req.query;

    const ownerIdTeam = await getOwnerIdAndTeam(req, session);
    const ownerId = ownerIdTeam.ownerId;

    const projectIdsAsList =
      typeof projectIds === "string" ? [projectIds] : projectIds;

    let monitors: UptimeMonitor[] | { [projectId: string]: UptimeMonitor[] } =
      [];

    if (!projectIdsAsList || projectIdsAsList.length === 0) {
      // get all monitors for this owner
      monitors = await getMonitorsForOwner(
        ddbClient,
        env.UPTIME_MONITOR_TABLE_NAME,
        ownerId
      );
    } else {
      // get the projectId to monitor map
      monitors = await getMonitorsForMultipleProjectsForOwner(
        ddbClient,
        env.UPTIME_MONITOR_TABLE_NAME,
        env.UPTIME_MONITOR_TABLE_PID_GSI_NAME,
        projectIdsAsList,
        ownerId
      );
    }

    res.status(200);
    res.json(monitors);
  } catch (err) {
    console.log(err);
    res.status(500);
  }
}

async function updateHandler(
  req: NextApiRequest,
  res: NextApiResponse,
  session: Session
) {
  try {
    const { ownerId, team } = await getOwnerIdAndTeam(req, session);
    const { valid, productId } = await getProductPlanIdAndValidSubscription(
      ownerId,
      team
    );

    if (!productId || !valid) {
      res.status(403);
      return;
    }

    const monitor = req.body;
    if (!monitor || !isValidUptimeMonitor(monitor, productId)) {
      res.status(400);
      return;
    }
    // verify that the monitor id belongs to the user before updating
    const monitorExistsForUser = await getMonitorForUserByMonitorId(
      ddbClient,
      env.UPTIME_MONITOR_TABLE_NAME,
      ownerId,
      monitor.monitor_id
    );
    // check created_at and owner_id as a extra check against tampering with the request
    if (
      monitorExistsForUser === null ||
      monitorExistsForUser?.created_at !== monitor.created_at ||
      monitorExistsForUser.owner_id !== monitor.owner_id
    ) {
      res.status(403);
      return;
    }

    // reset any ongoing alert invocations on this monitor
    if (monitorExistsForUser.alert) {
      const mostRecentAlertInvocation =
        await getPreviousAlertInvocationForMonitor(
          ddbClient,
          monitorExistsForUser.monitor_id,
          env.ALERT_INVOCATION_TABLE_NAME
        );

      if (mostRecentAlertInvocation) {
        const ongoingReset = await setInvocationOngoingToFalse(
          ddbClient,
          mostRecentAlertInvocation,
          env.ALERT_INVOCATION_TABLE_NAME
        );

        // TODO determine if we should throw error when cannot reset
      }
    }

    const updatedMonitor = createUpdatedMonitor(monitor);

    const updated = await putMonitor(
      ddbClient,
      env.UPTIME_MONITOR_TABLE_NAME,
      updatedMonitor,
      true
    );
    if (updated) {
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

async function createHandler(
  req: NextApiRequest,
  res: NextApiResponse,
  session: Session
) {
  try {
    // check if user is allowed to create a new monitor
    const { ownerId, team } = await getOwnerIdAndTeam(req, session);
    const { valid, productId } = await getProductPlanIdAndValidSubscription(
      ownerId,
      team
    );

    if (!productId || !valid) {
      res.status(403);
      return;
    }

    const allowance = getUptimeMonitorAllowanceFromProductId(productId);
    const currentMonitorsTotal = (
      await getMonitorsForOwner(
        ddbClient,
        env.UPTIME_MONITOR_TABLE_NAME,
        ownerId
      )
    ).length;

    if (allowance <= currentMonitorsTotal || !valid) {
      res.status(403);
      return;
    }

    // validate the new monitor
    const monitor = req.body;
    if (!monitor || !isValidCoreUptimeMonitor(monitor, productId)) {
      res.status(400);
      return;
    }

    // user is allowed to create monitor
    const newMonitor = createNewMonitorFromCore(monitor, ownerId);
    const created = await putMonitor(
      ddbClient,
      env.UPTIME_MONITOR_TABLE_NAME,
      newMonitor,
      false
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

    const { ownerId, team } = await getOwnerIdAndTeam(req, session);

    const deleted = await deleteMonitor(
      ddbClient,
      env.UPTIME_MONITOR_TABLE_NAME,
      monitorId as string,
      ownerId
    );

    deleted ? res.status(200) : res.status(500);
  } catch (err) {
    console.log(err);
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
