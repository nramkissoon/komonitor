import { SupportedRegion } from "../config/index";

export interface UptimeMonitorStatus {
  monitor_id: string;
  timestamp: number;
  status: "up" | "down";
  latency: number;
  region: SupportedRegion;
}
