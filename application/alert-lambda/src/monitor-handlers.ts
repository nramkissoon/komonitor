import { AlertInvocation, UptimeMonitorStatus } from "utils";
import { config, ddbClient } from "./config";
import {
  getPreviousAlertInvocationForMonitor,
  getStatusesForUptimeMonitor,
  getUptimeMonitorForUserByMonitorId,
  getUserById,
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

export async function handleUptimeMonitor(monitorId: string, userId: string) {
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

  const user = await getUserById(ddbClient, config.userTableName, userId);
  if (!user) {
    return;
  }

  const channels = alert.channels;
  let alertTriggered = true;

  for (let channelType of channels) {
    if (channelType === "Email") {
      const emailSent = await sendUptimeMonitorAlertEmail(
        monitor,
        alert,
        triggeringStatuses,
        user
      );
      if (!emailSent) {
        alertTriggered = false;
      }
    }
    if (channelType === "Slack") {
      const slackSent = await sendUptimeMonitorSlackAlert(monitor, alert, user);
      if (!slackSent) {
        alertTriggered = false;
      }
    }
    if (channelType === "Webhook") {
      const secret = await getUserWebhookSecret(user.id);
      if (!secret) {
        alertTriggered = false;
        console.log("no user secret, but webhook channel type provided");
      } else {
        if (alert.recipients.Webhook && alert.recipients.Webhook.length > 0) {
          const webhookSent = await webhookRequestAlert(
            alert.recipients.Webhook[0],
            invocation,
            secret
          );
          if (!webhookSent) {
            alertTriggered = false;
          }
        }
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
