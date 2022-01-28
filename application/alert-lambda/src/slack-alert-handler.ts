import fetch from "isomorphic-fetch";
import { Alert, UptimeMonitor, User } from "project-types";
import { regionToLocationStringMap } from "./config";

const createUptimeMonitorSlackAlertMessage = (
  alert: Alert,
  monitor: UptimeMonitor
) => {
  return {
    text: `ALERT - ${monitor.name} Uptime Monitor in ${
      regionToLocationStringMap[monitor.region]
    }`,
    attachments: [
      {
        color: "#E53E3E",
        blocks: [
          {
            type: "section",
            text: {
              type: "mrkdwn",
              text: `*${monitor.url}* *DOWN* for ${monitor.failures_before_alert} uptime check(s).\n*${monitor.failures_before_alert} X ${monitor.frequency} minutes of downtime detected.*\nAlert description: ${alert.description}`,
            },
          },
          {
            type: "section",
            text: {
              type: "mrkdwn",
              text: `*<https://komonitor.com/app/uptime/${monitor.monitor_id}|View monitor>*`,
            },
          },
        ],
      },
    ],
  };
};

const getTeamChannelIdFromCompoundKey = (key: string) => {
  const array = key.split("#");
  if (array.length !== 2)
    throw new Error("invalid slack compound key on monitor");
  return {
    team: array[0],
    channel: array[1],
  };
};

export const sendUptimeMonitorSlackAlert = async (
  monitor: UptimeMonitor,
  alert: Alert,
  user: User
): Promise<boolean> => {
  try {
    if (!user.slack_installations || user.slack_installations.length === 0) {
      throw new Error(`no slack installation for user ${user.id}`);
    }

    if (
      !alert.recipients ||
      !alert.recipients.Slack ||
      alert.recipients.Slack.length === 0
    ) {
      throw new Error(`no slack alert for user ${user.id}`);
    }

    const slackTeamChannelId = getTeamChannelIdFromCompoundKey(
      alert.recipients.Slack[0]
    );

    const webhook = user.slack_installations.filter(
      (i) =>
        i.incomingWebhook?.channelId === slackTeamChannelId.channel &&
        i.team?.id === slackTeamChannelId.team
    )[0].incomingWebhook?.url;

    if (!webhook) {
      throw new Error(`no Slack webhook for user ${user.id}`);
    }

    const response = await fetch(webhook, {
      method: "POST",
      headers: new Headers({ "content-type": "application/json" }),
      body: JSON.stringify(
        createUptimeMonitorSlackAlertMessage(alert, monitor)
      ),
    });

    if (!response.ok) {
      throw new Error(
        `failed to send alert for ${user.id} ${monitor.monitor_id}`
      );
    }

    return true;
  } catch (err) {
    console.error(err);
    return false;
  }
};
