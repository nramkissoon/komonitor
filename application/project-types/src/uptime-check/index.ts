import { UptimeCheckSupportedFrequenciesInMinutes } from "../config/index";

export interface CoreUptimeMonitor {
  url: string;
  name: string;
  region: string;
  frequency: UptimeCheckSupportedFrequenciesInMinutes;
  failures_before_alert?: number;
  webhook_url?: string;
  alert_id?: string;
}

export interface UptimeMonitor extends CoreUptimeMonitor {
  owner_id: string;
  monitor_id: string;
  created_at: number;
  last_updated: number;
}

export interface UptimeMonitorJob {
  monitor_id: string;
  owner_id: string;
  url: string;
  name: string;
  region: string;
  webhook_url?: string;
}

export interface UptimeMonitorStatus {
  monitor_id: string;
  timestamp: number;
  status: "up" | "down";
  latency: number;
  region: string;
}

export interface UptimeMonitorWebhookNotification {
  url: string;
  name: string;
  trigger: "up" | "down";
  region: string;
  monitor_type: "uptime";
  latency: number;
}

export interface UptimeMonitorWithStatuses extends UptimeMonitor {
  statuses?: UptimeMonitorStatus[];
}
