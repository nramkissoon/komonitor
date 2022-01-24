import {
  CoreUptimeMonitor,
  UptimeMonitor,
  UptimeMonitorStatus,
} from "project-types";
import { v4 as uuidv4 } from "uuid";

function createMonitorId() {
  return "up-" + uuidv4();
}

export const yesterday = 24 * 60 * 60 * 1000;
export const sevenDaysAgo = 7 * 24 * 60 * 60 * 1000;
export const thirtyDaysAgo = 30 * 24 * 60 * 60 * 1000;

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
    failures_before_alert: core.failures_before_alert,
    webhook_url: !core.webhook_url ? undefined : core.webhook_url,
    alert: core.alert ?? undefined,
    http_parameters: core.http_parameters,
  };
  return monitor;
}

export function createUpdatedMonitor(monitor: UptimeMonitor) {
  const updatedMonitor: UptimeMonitor = { ...monitor };
  updatedMonitor.last_updated = new Date().getTime();
  if (!monitor.webhook_url) updatedMonitor.webhook_url = undefined;
  if (!monitor.alert) updatedMonitor.alert = undefined;
  return updatedMonitor;
}

export function createMonitorIdToStatusArrayMap(
  ids: string[],
  statuses: UptimeMonitorStatus[]
) {
  const map: { [key: string]: UptimeMonitorStatus[] } = {};
  for (let id of ids) {
    if (!map[id]) {
      map[id] = [];
    }
  }
  for (let status of statuses) {
    const id = status.monitor_id;
    map[id].push(status);
  }
  return map;
}

export function createProjectIdToMonitorArrayMap(
  ids: string[],
  monitors: UptimeMonitor[]
) {
  const map: { [key: string]: UptimeMonitor[] } = {};
  for (let id of ids) {
    if (!map[id]) {
      map[id] = [];
    }
  }
  for (let monitor of monitors) {
    const id = monitor.project_id;
    map[id].push(monitor);
  }
  return map;
}
