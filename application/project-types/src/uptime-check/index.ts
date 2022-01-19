import { Options, Response } from "got";
import { Alert } from "../alert/index";

export type HttpMethods = "GET" | "POST" | "PATCH" | "PUT" | "HEAD" | "DELETE";

export interface HttpParameters {
  method: HttpMethods;
  headers?: { [header: string]: string };
  body?: string;
}

export interface CoreUptimeMonitor {
  url: string;
  name: string;
  region: string;
  frequency: number;
  http_parameters: HttpParameters;
  alert?: Alert;
  failures_before_alert?: number;
  webhook_url?: string;
  paused?: boolean;
}

export interface UptimeMonitor extends CoreUptimeMonitor {
  owner_id: string;
  monitor_id: string;
  created_at: number;
  last_updated: number;
}

export type UptimeStatusResponse = Pick<
  Response,
  | "timings"
  | "body"
  | "headers"
  | "requestUrl"
  | "ip"
  | "redirectUrls"
  | "url"
  | "retryCount"
  | "statusCode"
  | "statusMessage"
  | "isFromCache"
  | "aborted"
  | "complete"
>;

export type UptimeStatusRequest = Omit<
  Options,
  "parseJson" | "stringifyJson" | "pagination" | "hooks" | "request" | "retry"
>;

export interface UptimeMonitorStatus {
  monitor_id: string;
  timestamp: number;
  status: "up" | "down";
  request: UptimeStatusRequest;
  response: UptimeStatusResponse;
  monitor_snapshot: UptimeMonitor;
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
