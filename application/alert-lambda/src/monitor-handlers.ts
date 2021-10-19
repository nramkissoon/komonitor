import { AlertInvocation, UptimeMonitorStatus } from "project-types";
import { config, ddbClient } from "./config";
import {
  getAlertForUserByAlertId,
  getPreviousInvocationForAlert,
  getStatusesForUptimeMonitor,
  getUptimeMonitorForUserByMonitorId,
  writeAlertInvocation,
} from "./dynamo-db";
import { sendUptimeMonitorAlertEmail } from "./email-alert-handlers";

function wasStatusTriggeredPreviousAlert(
  status: { id: string; timestamp: number },
  previousStatuses: { id: string; timestamp: number }[]
) {
  for (let previousStatus of previousStatuses) {
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
    monitor.alert_id === undefined ||
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

  const alert = await getAlertForUserByAlertId(
    ddbClient,
    config.alertTableName,
    userId,
    monitor.alert_id
  );

  if (alert === null || alert === undefined || alert.state === "disabled") {
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

  const previousInvocation = await getPreviousInvocationForAlert(
    ddbClient,
    alert.alert_id,
    config.alertInvocationTableName,
    config.alertInvocationTableTimeStampLsiName
  );

  // check if previous invocation was triggered by any of the statuses, don't check if no invocation
  if (previousInvocation) {
    for (let status of triggeringStatuses) {
      const statusIdT = {
        id: status.monitor_id,
        timestamp: status.timestamp,
      };
      if (
        wasStatusTriggeredPreviousAlert(statusIdT, previousInvocation.statuses)
      ) {
        alertShouldTrigger = false;
      }
    }
  }

  if (!alertShouldTrigger) {
    return;
  }

  const alertType = alert.type;
  let alertTriggered = false;
  const invocation: AlertInvocation = {
    alert_id: alert.alert_id,
    alert: alert,
    timestamp: Date.now(),
    monitor_id: monitorId,
    monitor_type: "uptime-monitor",
    monitor: monitor,
    statuses: triggeringStatuses.map((status) => ({
      id: status.monitor_id,
      timestamp: status.timestamp,
    })),
  };
  switch (alertType) {
    case "Email":
      alertTriggered = await sendUptimeMonitorAlertEmail(
        monitor,
        alert,
        triggeringStatuses
      );
      break;
    default:
      break;
  }

  if (alertTriggered) {
    await writeAlertInvocation(
      ddbClient,
      config.alertInvocationTableName,
      invocation
    );
  }
}
