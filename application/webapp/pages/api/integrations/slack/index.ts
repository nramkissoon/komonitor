import { NextApiRequest, NextApiResponse } from "next";
import { Session } from "next-auth";
import { getSession } from "next-auth/react";
import { Team } from "utils";
import { ddbClient, env } from "../../../../src/common/server-utils";
import {
  deleteTeamSlackInstallation,
  getTeamById,
  getTeamSlackInstallationsFromTeamObj,
  userCanEdit,
} from "../../../../src/modules/teams/server/db";
import {
  getMonitorsForOwner,
  putMonitor,
} from "../../../../src/modules/uptime/monitor-db";
import {
  deleteUserSlackInstallation,
  getUserSlackInstallations,
} from "../../../../src/modules/user/user-db";

const getTeamChannelIdFromCompoundKey = (key: string) => {
  const array = key.split("#");
  if (array.length !== 2)
    throw new Error("invalid slack compound key on monitor");
  return {
    team: array[0],
    channel: array[1],
  };
};

const detachMonitorsWithSlackAlerts = async ({
  ownerId,
  slackChannel,
  slackTeam,
}: {
  ownerId: string;
  slackChannel: string;
  slackTeam: string;
}) => {
  const uptimeMonitors = await getMonitorsForOwner(
    ddbClient,
    env.UPTIME_MONITOR_TABLE_NAME,
    ownerId
  );
  const monitorsWithSlackAlerts = uptimeMonitors
    ? uptimeMonitors.filter((monitor) => {
        if (monitor.alert) {
          for (let channel of monitor.alert.channels) {
            if (channel === "Slack") {
              const compoundKey = monitor.alert.recipients.Slack![0];
              const components = getTeamChannelIdFromCompoundKey(compoundKey);
              if (
                components.channel === slackChannel &&
                components.team === slackTeam
              ) {
                return true;
              }
            }
          }
        }
        return false;
      })
    : [];

  const detachSlackAlertFromMonitorPromises: Promise<boolean>[] = [];

  for (let monitor of monitorsWithSlackAlerts) {
    if (monitor.alert) {
      monitor.alert.channels = monitor.alert.channels.filter(
        (channel) => channel !== "Slack"
      );
      monitor.alert.recipients.Slack = undefined;
      detachSlackAlertFromMonitorPromises.push(
        putMonitor(ddbClient, env.UPTIME_MONITOR_TABLE_NAME, monitor, true)
      );
    }
  }

  let monitorsDetached = true;

  if (detachSlackAlertFromMonitorPromises.length > 0) {
    monitorsDetached = (
      await Promise.all(detachSlackAlertFromMonitorPromises)
    ).reduce((prev, next) => prev && next);
  }

  return monitorsDetached;
};

const deleteSlackInstallationForUser = async (
  userId: string,
  channelId: string,
  teamId: string,
  res: NextApiResponse
) => {
  const slackInstallations = await getUserSlackInstallations(
    ddbClient,
    env.USER_TABLE_NAME,
    userId
  );

  if (slackInstallations.length === 0)
    throw new Error("no slack installation to delete");

  if (
    !(await detachMonitorsWithSlackAlerts({
      ownerId: userId,
      slackChannel: channelId,
      slackTeam: teamId,
    }))
  ) {
    res.status(403);
    return;
  }

  const deleted = await deleteUserSlackInstallation(
    ddbClient,
    env.USER_TABLE_NAME,
    userId,
    teamId,
    channelId
  );

  if (!deleted) {
    throw new Error("slack installation deletion failure");
  }

  res.status(200);
  return;
};

const deleteSlackInstallationForTeam = async ({
  team,
  slackChannel,
  slackTeam,
  res,
}: {
  team: Team;
  slackChannel: string;
  slackTeam: string;
  res: NextApiResponse;
}) => {
  const slackInstallations = getTeamSlackInstallationsFromTeamObj(team);
  if (slackInstallations.length === 0)
    throw new Error("no slack installation to delete");

  if (
    !(await detachMonitorsWithSlackAlerts({
      ownerId: team.id,
      slackChannel,
      slackTeam,
    }))
  ) {
    res.status(403);
    return;
  }

  const deleted = await deleteTeamSlackInstallation({
    team,
    slackChannel,
    slackTeam,
  });

  if (!deleted) {
    throw new Error("slack installation deletion failure");
  }

  res.status(200);
  return;
};

async function deleteHandler(
  req: NextApiRequest,
  res: NextApiResponse,
  session: Session
) {
  try {
    const { slackChannel, slackTeam, teamId } = req.body;
    if (!slackChannel || !slackTeam) {
      res.status(400);
      return;
    }

    const userId = session.uid as string;

    if (!teamId) {
      return deleteSlackInstallationForUser(
        userId,
        slackChannel,
        slackTeam,
        res
      );
    }

    const team = await getTeamById(teamId);
    if (!team || !userCanEdit(userId, team)) {
      res.status(403);
      return;
    }

    return deleteSlackInstallationForTeam({
      team,
      slackChannel,
      slackTeam,
      res,
    });
  } catch (err) {
    console.log(err);
    res.status(500);
    return;
  }
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = (await getSession({ req })) as Session;
  switch (req.method) {
    case "DELETE":
      await deleteHandler(req, res, session);
      break;
    default:
      res.status(405);
      break;
  }

  res.end();
}
