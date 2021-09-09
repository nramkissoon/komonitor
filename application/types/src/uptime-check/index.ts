import {
  MonitorType,
  SupportedRegion,
  UptimeCheckSupportedFrequenciesInMinutes,
} from "../config/index";

export interface UptimeMonitorWebhookNotification {
  url: string;
  name: string;
  trigger: "up" | "down";
  region: SupportedRegion;
  monitor_type: MonitorType;
  latency: number;
}

export interface UptimeMonitor {
  owner_id: string;
  monitor_id: string;
  created_at: number;
  last_updated: number;
  url: string;
  name: string;
  regions: SupportedRegion[];
  frequency: UptimeCheckSupportedFrequenciesInMinutes;
  retries: number;
  failures_before_alert?: number;
  webhook_url?: string;
  alert_ids?: string[];
}
export interface UptimeMonitorJob {
  monitor_id: string;
  url: string;
  name: string;
  region: SupportedRegion;
  retries: number;
  webhook_url?: string;
}

export interface UptimeMonitorStatus {
  monitor_id: string;
  timestamp: number;
  status: "up" | "down";
  latency: number;
  region: SupportedRegion;
}
