import fetch from "isomorphic-fetch";
import { Alert, SlackInstallation, Team, UptimeMonitor, User } from "utils";
import { regionToLocationStringMap } from "./config";

const createUptimeMonitorSlackAlertMessage = (
  alert: Alert,
  monitor: UptimeMonitor,
  isTeam: boolean,
  ownerId: string,
  alertType: "incident_start" | "incident_end"
) => {
  const baseUrl =
    "https://komonitor.com/" + (isTeam ? ownerId + "/" : "app/") + "/projects/";

  if (alertType === "incident_end") {
    return {
      text: `UP ALERT - ${monitor.name} Uptime Monitor in ${
        regionToLocationStringMap[monitor.region]
      }`,
      attachments: [
        {
          color: "#48BB78",
          blocks: [
            {
              type: "section",
              text: {
                type: "mrkdwn",
                text: `*${monitor.url}* is *UP*.\n*${
                  (monitor.failures_before_alert ?? 1) * monitor.frequency
                } min. of downtime experienced.*\nAlert description: ${
                  alert.description
                }`,
              },
            },
            {
              type: "section",
              text: {
                type: "mrkdwn",
                // TODO CHANGE FOR TEAMS
                text: `*<${baseUrl}${monitor.project_id}/uptime/${monitor.monitor_id}|View monitor>*`,
              },
            },
          ],
        },
      ],
    };
  }

  return {
    text: `DOWN ALERT - ${monitor.name} Uptime Monitor in ${
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
              text: `*${monitor.url}* *DOWN* for ${
                monitor.failures_before_alert
              } uptime check(s).\n*${
                (monitor.failures_before_alert ?? 1) * monitor.frequency
              } min. of downtime detected.*\nAlert description: ${
                alert.description
              }`,
            },
          },
          {
            type: "section",
            text: {
              type: "mrkdwn",
              // TODO CHANGE FOR TEAMS
              text: `*<${baseUrl}${monitor.project_id}/uptime/${monitor.monitor_id}|View monitor>*`,
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

const ownerIsTeam = (owner: User | Team): owner is Team => {
  return owner.type === "TEAM";
};

const getWebhookForTeam = ({
  team,
  channel,
  slackTeam,
}: {
  team: Team;
  channel: string;
  slackTeam: string;
}) => {
  const matchingInstallations = team.integrations.filter((i) => {
    if (i.type === "Slack") {
      return (
        (i.data as SlackInstallation).incomingWebhook?.channelId === channel &&
        (i.data as SlackInstallation).team?.id === slackTeam
      );
    }
    return false;
  });

  if (matchingInstallations.length === 0) return null;
  else
    return (matchingInstallations[0].data as SlackInstallation).incomingWebhook
      ?.url;
};

export const sendUptimeMonitorSlackAlert = async (
  monitor: UptimeMonitor,
  alert: Alert,
  owner: User | Team,
  alertType: "incident_start" | "incident_end"
): Promise<boolean> => {
  try {
    if (
      !alert.recipients ||
      !alert.recipients.Slack ||
      alert.recipients.Slack.length === 0
    ) {
      throw new Error(`no slack alert for owner ${owner.id}`);
    }

    const slackTeamChannelId = getTeamChannelIdFromCompoundKey(
      alert.recipients.Slack[0]
    );

    let webhook;
    if (ownerIsTeam(owner)) {
      webhook = getWebhookForTeam({
        team: owner,
        channel: slackTeamChannelId.channel,
        slackTeam: slackTeamChannelId.team,
      });
    } else {
      if (
        !owner.slack_installations ||
        owner.slack_installations.length === 0
      ) {
        throw new Error(`no slack installation for user ${owner.id}`);
      }
      webhook = owner.slack_installations.filter(
        (i) =>
          i.incomingWebhook?.channelId === slackTeamChannelId.channel &&
          i.team?.id === slackTeamChannelId.team
      )[0].incomingWebhook?.url;
    }

    if (!webhook) {
      throw new Error(`no Slack webhook for owner ${owner.id}`);
    }

    const response = await fetch(webhook, {
      method: "POST",
      headers: new Headers({ "content-type": "application/json" }),
      body: JSON.stringify(
        createUptimeMonitorSlackAlertMessage(
          alert,
          monitor,
          ownerIsTeam(owner),
          owner.id,
          alertType
        )
      ),
    });

    if (!response.ok) {
      throw new Error(
        `failed to send alert for ${owner.id} ${monitor.monitor_id}`
      );
    }

    return true;
  } catch (err) {
    console.error(err);
    return false;
  }
};
