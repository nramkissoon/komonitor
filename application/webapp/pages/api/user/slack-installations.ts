import { WebClient } from "@slack/web-api";
import { NextApiRequest, NextApiResponse } from "next";
import { Session } from "next-auth";
import { getSession } from "next-auth/client";
import { ddbClient, env } from "../../../src/common/server-utils";
import {
  deleteAlert,
  getAlertsForUser,
} from "../../../src/modules/alerts/alert-db";
import { detachAlertFromMonitors } from "../../../src/modules/uptime/monitor-db";
import {
  deleteUserSlackInstallation,
  getUserSlackInstallation,
  updateUserSlackInstallation,
} from "../../../src/modules/user/user-db";
async function getHandler(
  req: NextApiRequest,
  res: NextApiResponse,
  session: Session
) {
  try {
    const userId = session.uid as string;
    const slackInstallation = await getUserSlackInstallation(
      ddbClient,
      env.USER_TABLE_NAME,
      userId
    );

    if (slackInstallation) {
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
          slackInstallation.incomingWebhook?.channel !== channel?.channel?.name;

        if (slackInstallation.team && team.team?.name)
          slackInstallation.team.name = team.team?.name;
        if (slackInstallation.incomingWebhook && channel?.channel?.name)
          slackInstallation.incomingWebhook.channel = channel?.channel?.name;

        if (mustUpdate) {
          await updateUserSlackInstallation(
            ddbClient,
            env.USER_TABLE_NAME,
            userId,
            slackInstallation
          );
        }
      } catch (err) {
        console.log(err);
        console.log("updated team and channel check failed");
      }
    }

    if (slackInstallation) slackInstallation!.incomingWebhook!.url = "";
    res.status(200);
    if (slackInstallation) res.json(slackInstallation);
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
    const userId = session.uid as string;

    const slackInstallation = await getUserSlackInstallation(
      ddbClient,
      env.USER_TABLE_NAME,
      userId
    );

    if (!slackInstallation) throw new Error("no slack installation to delete");

    const alerts = await getAlertsForUser(
      ddbClient,
      env.ALERT_TABLE_NAME,
      userId
    );
    const slackAlerts = alerts
      ? alerts.filter((alert) => alert.type === "Slack")
      : [];

    const deleteSlackAlertPromises: Promise<boolean>[] = [];
    const detachMonitorsFromAlertPromises: Promise<boolean>[] = [];

    for (let alert of slackAlerts) {
      detachMonitorsFromAlertPromises.push(
        detachAlertFromMonitors(
          ddbClient,
          env.UPTIME_MONITOR_TABLE_NAME,
          userId,
          alert.alert_id
        )
      );
      deleteSlackAlertPromises.push(
        deleteAlert(ddbClient, env.ALERT_TABLE_NAME, alert.alert_id, userId)
      );
    }

    let alertsDeleted = true;
    let monitorsDetached = true;

    if (deleteSlackAlertPromises.length > 0) {
      alertsDeleted = (await Promise.all(deleteSlackAlertPromises)).reduce(
        (prev, next) => prev && next
      );
    }

    if (detachMonitorsFromAlertPromises.length > 0) {
      monitorsDetached = (
        await Promise.all(detachMonitorsFromAlertPromises)
      ).reduce((prev, next) => prev && next);
    }

    if (!alertsDeleted || !monitorsDetached) {
      res.status(403);
      return;
    }

    const slackClient = new WebClient(slackInstallation.bot?.token);

    const uninstallResult = await slackClient.apps.uninstall({
      client_id: env.SLACK_CLIENT_ID,
      client_secret: env.SLACK_CLIENT_SECRET,
    });

    if (!uninstallResult.ok) throw new Error("could not uninstall slack app");

    const deleted = await deleteUserSlackInstallation(
      ddbClient,
      env.USER_TABLE_NAME,
      userId
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
