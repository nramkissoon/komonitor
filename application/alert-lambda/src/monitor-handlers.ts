import {
  Alert,
  AlertInvocation,
  UptimeMonitor,
  UptimeMonitorStatus,
} from "utils";
import { config, ddbClient } from "./config";
import { sendUptimeMonitorDiscordAlert } from "./discord-alert-handler";
import {
  getOwnerById,
  getPreviousAlertInvocationForMonitor,
  getStatusesForUptimeMonitor,
  getUptimeMonitorForUserByMonitorId,
  getUserWebhookSecret,
  writeAlertInvocation,
} from "./dynamo-db";
import { sendUptimeMonitorAlertEmail } from "./email-alert-handlers";
import { sendUptimeMonitorSlackAlert } from "./slack-alert-handler";
import { webhookRequestAlert } from "./webhook-alert-handler";

function wasStatusTriggeredPreviousAlert(
  status: { id: string; timestamp: number },
  previousStatuses: { id: string; timestamp: number }[]
) {
  for (let previousStatus of previousStatuses) {
    console.log(status);
    console.log(previousStatus);
    if (
      previousStatus.id === status.id &&
      previousStatus.timestamp === status.timestamp
    ) {
      return true;
    }
  }
  return false;
}

const handleIncidentEndAlert = async ({
  statuses,
  monitor,
  alert,
}: {
  statuses: UptimeMonitorStatus[];
  monitor: UptimeMonitor;
  alert: Alert;
}) => {
  const owner = await getOwnerById(monitor.owner_id);
  if (!owner) {
    return;
  }
  const previousInvocation = await getPreviousAlertInvocationForMonitor(
    ddbClient,
    monitor.monitor_id,
    config.alertInvocationTableName
  );
  const now = Date.now();
  const invocation: AlertInvocation = {
    type: "incident_end",
    monitor_id: monitor.monitor_id,
    alert: alert,
    timestamp: now,
    monitor: monitor,
    statuses:
      statuses.length > 0
        ? [{ id: statuses[0].monitor_id, timestamp: statuses[0].timestamp }]
        : [],
    ongoing: true,
  };

  const channels = alert.channels;
  let alertTriggered = false;
  for (let channelType of channels) {
    if (channelType === "Email") {
      const emailSent = await sendUptimeMonitorAlertEmail(
        monitor,
        alert,
        statuses.length > 0 ? statuses : [],
        owner,
        "incident_end"
      );
      if (emailSent) {
        alertTriggered = true;
      }
    }
    if (channelType === "Slack") {
      const slackSent = await sendUptimeMonitorSlackAlert(
        monitor,
        alert,
        owner,
        "incident_end"
      );
      if (slackSent) {
        alertTriggered = true;
      }
    }
    if (channelType === "Webhook") {
      const secret = await getUserWebhookSecret(owner.id);
      if (!secret) {
        alertTriggered = true;
        console.log("no user secret, but webhook channel type provided");
      } else {
        if (alert.recipients.Webhook && alert.recipients.Webhook.length > 0) {
          const webhookSent = await webhookRequestAlert(
            alert.recipients.Webhook[0],
            invocation,
            secret
          );
          if (webhookSent) {
            alertTriggered = true;
          }
        }
      }
    }
    if (channelType === "Discord") {
      const discordSent = await sendUptimeMonitorDiscordAlert(
        monitor,
        alert,
        owner,
        "incident_end"
      );
      if (discordSent) {
        alertTriggered = true;
      }
    }
  }

  if (alertTriggered) {
    await writeAlertInvocation(
      ddbClient,
      config.alertInvocationTableName,
      invocation
    );
  }
};

export async function handleUptimeMonitor(
  monitorId: string,
  userId: string,
  alertType: "incident_start" | "incident_end"
) {
  const monitor = await getUptimeMonitorForUserByMonitorId(
    ddbClient,
    config.uptimeMonitorTableName,
    userId as string,
    monitorId as string
  );

  // check if alert is attached, exit if none
  if (
    monitor === null ||
    monitor === undefined ||
    monitor.failures_before_alert === undefined
  ) {
    throw new Error(
      `invalid monitor (${
        monitor ? monitor.monitor_id : monitor
      }) to alert from`
    );
  }

  const statuses = await getStatusesForUptimeMonitor(
    ddbClient,
    monitorId,
    config.uptimeMonitorStatusTableName,
    (monitor.failures_before_alert as number) + 2 // +2 buffer
  );

  const alert = monitor.alert;

  if (alert === undefined) {
    throw new Error(`Alert is ${alert}`);
  }

  if (alertType === "incident_end") {
    // handle up alert logic
    return;
  }

  let alertShouldTrigger: boolean = true;
  const triggeringStatuses: UptimeMonitorStatus[] = [];
  let failureCount = monitor.failures_before_alert as number;
  for (let i = 0; i < failureCount && i < statuses.length; i += 1) {
    if (statuses[i].status === "up") {
      alertShouldTrigger = false;
      break;
    } else {
      triggeringStatuses.push(statuses[i]);
    }
  }

  if (triggeringStatuses.length !== failureCount) alertShouldTrigger = false;

  const previousInvocation = await getPreviousAlertInvocationForMonitor(
    ddbClient,
    monitor.monitor_id,
    config.alertInvocationTableName
  );

  if (previousInvocation?.ongoing) {
    return; // do nothing because we do not want to spam alerts
  }

  // check if previous invocation was triggered by any of the statuses, don't check if no invocation
  if (previousInvocation) {
    for (let status of triggeringStatuses) {
      const statusIdTimestamp = {
        id: status.monitor_id,
        timestamp: status.timestamp,
      };
      if (
        wasStatusTriggeredPreviousAlert(
          statusIdTimestamp,
          previousInvocation.statuses
        )
      ) {
        alertShouldTrigger = false;
      }
    }
  }

  if (!alertShouldTrigger) {
    return;
  }

  const now = Date.now();
  const invocation: AlertInvocation = {
    type: "incident_start",
    monitor_id: monitorId,
    alert: alert,
    timestamp: now,
    monitor: monitor,
    statuses: triggeringStatuses.map((status) => ({
      id: status.monitor_id,
      timestamp: status.timestamp,
    })),
    ongoing: true,
  };

  const owner = await getOwnerById(userId);
  if (!owner) {
    return;
  }

  const channels = alert.channels;
  let alertTriggered = false;

  for (let channelType of channels) {
    if (channelType === "Email") {
      const emailSent = await sendUptimeMonitorAlertEmail(
        monitor,
        alert,
        triggeringStatuses,
        owner,
        alertType
      );
      if (emailSent) {
        alertTriggered = true;
      }
    }
    if (channelType === "Slack") {
      const slackSent = await sendUptimeMonitorSlackAlert(
        monitor,
        alert,
        owner,
        alertType
      );
      if (slackSent) {
        alertTriggered = true;
      }
    }
    if (channelType === "Webhook") {
      const secret = await getUserWebhookSecret(owner.id);
      if (!secret) {
        alertTriggered = true;
        console.log("no user secret, but webhook channel type provided");
      } else {
        if (alert.recipients.Webhook && alert.recipients.Webhook.length > 0) {
          const webhookSent = await webhookRequestAlert(
            alert.recipients.Webhook[0],
            invocation,
            secret
          );
          if (webhookSent) {
            alertTriggered = true;
          }
        }
      }
    }
    if (channelType === "Discord") {
      const discordSent = await sendUptimeMonitorDiscordAlert(
        monitor,
        alert,
        owner,
        alertType
      );
      if (discordSent) {
        alertTriggered = true;
      }
    }
  }

  if (alertTriggered) {
    await writeAlertInvocation(
      ddbClient,
      config.alertInvocationTableName,
      invocation
    );
  }
}
