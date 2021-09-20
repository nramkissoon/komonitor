import {
  MonitorType,
  SupportedRegion,
  UptimeCheckSupportedFrequenciesInMinutes,
} from "../config/index";

export interface CoreUptimeMonitor {
  url: string;
  name: string;
  region: SupportedRegion;
  frequency: UptimeCheckSupportedFrequenciesInMinutes;
  retries: number;
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

export interface UptimeMonitorWebhookNotification {
  url: string;
  name: string;
  trigger: "up" | "down";
  region: SupportedRegion;
  monitor_type: MonitorType;
  latency: number;
}
