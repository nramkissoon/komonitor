import { Alert, UptimeMonitor, UptimeMonitorStatus } from "project-types";

export async function sendUptimeMonitorAlertEmail(
  monitor: UptimeMonitor,
  alert: Alert,
  statuses: UptimeMonitorStatus[]
) {
  // TEST
  console.log(`TEST EMAIL ALERT: ${monitor.monitor_id} - ${alert.alert_id}`);
}
