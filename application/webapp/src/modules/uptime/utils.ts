import { CoreUptimeMonitor, UptimeMonitor } from "types";

export function createNewMonitorFromCore(
  core: CoreUptimeMonitor,
  userId: string
): UptimeMonitor {
  const monitor: UptimeMonitor = {
    owner_id: "",
    monitor_id: "",
    created_at: 0,
    last_updated: 0,
    url: "",
    name: "",
    region: "us-east-1",
    frequency: 1,
    retries: 0,
    failures_before_alert: 0,
    webhook_url: "",
    alert_ids: [],
  };
  return monitor;
}
