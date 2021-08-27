import { MonitorType, SupportedRegion } from "../config/index";

export interface UptimeMonitorWebhookNotification {
  url: string;
  name: string;
  trigger: "up" | "down";
  region: SupportedRegion;
  monitor_type: MonitorType;
  latency: number;
}
