import { config, ddbClient } from "./config";
import {
  getStatusesForUptimeMonitor,
  getUptimeMonitorForUserByMonitorId,
} from "./dynamo-db";

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
    monitor.alert_id === undefined
  ) {
    throw new Error("invalid monitor to alert from");
  }

  const statuses = await getStatusesForUptimeMonitor(
    ddbClient,
    monitorId,
    config.uptimeMonitorStatusTableName,
    (monitor.failures_before_alert as number) + 2 // +2 buffer
  );
}
