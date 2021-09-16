import { CoreUptimeMonitor, UptimeMonitor } from "types";
import { v4 as uuidv4 } from "uuid";

function createMonitorId() {
  return "up-" + uuidv4();
}

export function createNewMonitorFromCore(
  core: CoreUptimeMonitor,
  userId: string
): UptimeMonitor {
  const now = new Date().getTime();
  const monitor: UptimeMonitor = {
    owner_id: userId,
    monitor_id: createMonitorId(),
    created_at: now,
    last_updated: now,
    url: core.url,
    name: core.name,
    region: core.region,
    frequency: core.frequency,
    retries: core.retries,
    failures_before_alert: core.failures_before_alert,
    webhook_url: !core.webhook_url ? undefined : core.webhook_url,
    alert_id: !core.alert_id ? undefined : core.alert_id,
  };
  return monitor;
}
