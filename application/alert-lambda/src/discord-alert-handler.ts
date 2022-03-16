import { WebhookClient } from "discord.js";
import {
  Alert,
  DiscordWebhookIntegration,
  Team,
  UptimeMonitor,
  User,
} from "utils";

const ownerIsTeam = (owner: User | Team): owner is Team => {
  return owner.type === "TEAM";
};

export const sendUptimeMonitorDiscordAlert = async (
  monitor: UptimeMonitor,
  alert: Alert,
  owner: User | Team
): Promise<boolean> => {
  try {
    if (
      !alert.recipients ||
      !alert.recipients.Discord ||
      alert.recipients.Discord.length === 0
    ) {
      throw new Error(`no discord alert for owner ${owner.id}`);
    }

    const discordWebhookId = alert.recipients.Discord[0];
    const integrations = owner.integrations ?? [];
    const discordIntegration = integrations.find((i) => {
      if (i.type === "DiscordWebhook") {
        if (
          (i.data as DiscordWebhookIntegration).webhook.id === discordWebhookId
        ) {
          return true;
        }
      }
      return false;
    })?.data as DiscordWebhookIntegration;

    if (!discordIntegration)
      throw new Error("id in alert not found in integrations for owner");

    const client = new WebhookClient({
      token: discordIntegration.webhook.token,
      id: discordIntegration.webhook.id,
    });

    const baseUrl =
      "https://komonitor.com/" +
      (ownerIsTeam(owner) ? owner.id + "/" : "app/") +
      "/projects/";

    const discordRequest = await client.send({
      content: "ALERT",
      embeds: [
        {
          title: `${monitor.name} uptime monitor is DOWN`,
          description: alert.description,
          color: 0xe53e3e,
          fields: [
            { name: "URL", value: monitor.url },
            { name: "Region", value: monitor.region },
            {
              name: "Failures before alert",
              value: monitor.failures_before_alert?.toString() ?? "",
            },
            {
              name: "Check Frequency",
              value: `every ${monitor.frequency} minutes`,
            },
          ],

          footer: {
            text: `View monitor at: ${baseUrl}${monitor.project_id}/uptime/${monitor.monitor_id}`,
          },
        },
      ],
    });

    if (!discordRequest.nonce) throw new Error("discord failed to send alert");

    return true;
  } catch (err) {
    console.error(err);
    return false;
  }
};
