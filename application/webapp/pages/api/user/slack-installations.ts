import { WebClient } from "@slack/web-api";
import { NextApiRequest, NextApiResponse } from "next";
import { Session } from "next-auth";
import { getSession } from "next-auth/client";
import { ddbClient, env } from "../../../src/common/server-utils";
import {
  getMonitorsForOwner,
  putMonitor,
} from "../../../src/modules/uptime/monitor-db";
import {
  deleteUserSlackInstallation,
  getUserSlackInstallations,
  updateUserSlackInstallation,
} from "../../../src/modules/user/user-db";

const getTeamChannelIdFromCompoundKey = (key: string) => {
  const array = key.split("#");
  if (array.length !== 2)
    throw new Error("invalid slack compound key on monitor");
  return {
    team: array[0],
    channel: array[1],
  };
};

async function getHandler(
  req: NextApiRequest,
  res: NextApiResponse,
  session: Session
) {
  try {
    const userId = session.uid as string;
    const slackInstallations = await getUserSlackInstallations(
      ddbClient,
      env.USER_TABLE_NAME,
      userId
    );
    for (let slackInstallation of slackInstallations) {
      if (slackInstallation) {
        const oldInstallation = JSON.parse(JSON.stringify(slackInstallation)); // needs to be a different reference
        const slackClient = new WebClient(slackInstallation.bot?.token);

        try {
          const team = await slackClient.team.info({
            team: slackInstallation.team?.id,
          });
          let channel;
          if (slackInstallation.incomingWebhook?.channelId) {
            channel = await slackClient.conversations.info({
              channel: slackInstallation.incomingWebhook?.channelId,
            });
          }

          const mustUpdate =
            slackInstallation.team?.name !== team.team?.name ||
            slackInstallation.incomingWebhook?.channel !==
              channel?.channel?.name;

          if (slackInstallation.team && team.team?.name)
            slackInstallation.team.name = team.team?.name;
          if (slackInstallation.incomingWebhook && channel?.channel?.name)
            slackInstallation.incomingWebhook.channel = channel?.channel?.name;

          if (mustUpdate) {
            await updateUserSlackInstallation(
              ddbClient,
              env.USER_TABLE_NAME,
              userId,
              oldInstallation,
              slackInstallation
            );
          }

          if (slackInstallation) slackInstallation!.incomingWebhook!.url = "";
        } catch (err) {
          console.log(err);
          console.log("updated team and channel check failed");
        }
      }
    }
    res.status(200);
    res.json(slackInstallations);
    return;
  } catch (err) {
    console.log(err);
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
    const teamChannelId = JSON.parse(req.body); // ???????????????????
    const teamId = teamChannelId.teamId;
    const channelId = teamChannelId.channelId;

    if (!teamId || !channelId) {
      res.status(400);
      return;
    }

    const userId = session.uid as string;

    const slackInstallations = await getUserSlackInstallations(
      ddbClient,
      env.USER_TABLE_NAME,
      userId
    );

    if (slackInstallations.length === 0)
      throw new Error("no slack installation to delete");

    const uptimeMonitors = await getMonitorsForOwner(
      ddbClient,
      env.UPTIME_MONITOR_TABLE_NAME,
      userId
    );
    const monitorsWithSlackAlerts = uptimeMonitors
      ? uptimeMonitors.filter((monitor) => {
          if (monitor.alert) {
            for (let channel of monitor.alert.channels) {
              if (channel === "Slack") {
                const compoundKey = monitor.alert.recipients.Slack![0];
                const components = getTeamChannelIdFromCompoundKey(compoundKey);
                if (
                  components.channel === channelId &&
                  components.team === teamId
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

    if (!monitorsDetached) {
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

  res.end();
}
