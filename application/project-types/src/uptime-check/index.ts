import { Options, Response } from "got";
import { Alert } from "../alert/index";

export type HttpMethods = "GET" | "POST" | "PATCH" | "PUT" | "HEAD" | "DELETE";

export interface HttpParameters {
  method: HttpMethods;
  headers?: { [header: string]: string };
  body?: string;
  follow_redirects?: boolean;
}

export type TimingPhaseProperties =
  | "firstByte"
  | "download"
  | "total"
  | "wait"
  | "dns"
  | "tls"
  | "request"
  | "tcp";

export type NumericalOperators =
  | "equal"
  | "greater"
  | "less"
  | "greater_or_equal"
  | "less_or_equal"
  | "not_equal";

export type JsonOperators =
  | "equal"
  | "greater"
  | "less"
  | "greater_or_equal"
  | "less_or_equal"
  | "not_equal"
  | "null"
  | "not_null"
  | "empty"
  | "not_empty"
  | "contains"
  | "not_contains";

export interface LatencyCheck {
  property: TimingPhaseProperties;
  comparison: NumericalOperators;
  expected: number;
}

export interface CodeCheck {
  comparison: NumericalOperators;
  expected: number;
}

export interface BodyCheck {
  property: string;
  comparison: string;
  expected?: string;
  expectedType?: "string" | "number" | "boolean";
}

export interface UpConditionCheck {
  type: "latency" | "code" | "body";
  condition: LatencyCheck | CodeCheck | BodyCheck;
}

export interface CoreUptimeMonitor {
  url: string;
  name: string;
  region: string;
  frequency: number;
  http_parameters: HttpParameters;
  project_id: string;
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
