import { Alert } from "../alert/index";

export interface CoreUptimeMonitor {
  url: string;
  name: string;
  region: string;
  frequency: number;
  failures_before_alert?: number;
  webhook_url?: string;
  http_headers?: { [header: string]: string };
  alert?: Alert;
}

export interface UptimeMonitor extends CoreUptimeMonitor {
  owner_id: string;
  monitor_id: string;
  created_at: number;
  last_updated: number;
}

export interface UptimeMonitorStatus {
  monitor_id: string;
  timestamp: number;
  status: "up" | "down";
  latency: number;
  region: string;
  response_status_code: number;
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
