export interface Logger {
  log: (logLine: Object) => void;
}

export type LogLevel = "info" | "warn" | "error";

export interface LogLineComponentsData {
  tag: string;
  level: LogLevel;
  value: string | number | boolean;
  otherData?: Object;
}

export interface LogLineComponents extends LogLineComponentsData {
  timestamp: string;
}

export type MetricsPrefixData = {
  requestData?: Object;
  otherMetadata?: Object;
};

export type MetricsPrefix = {
  metricsId: string;
  requestData?: Object;
  otherMetadata?: Object;
};

export class Metrics {
  loggers: Logger[];
  prefix: MetricsPrefix;
  constructor(loggers: Logger[], metricsPrefixData?: MetricsPrefixData): void;
  async log(logLineComponents: LogLineComponents): void;
}

export type MethodMetricLoggingDecorator = (
  metrics: Metrics
) => (
  target: Object,
  propertyKey: string,
  descriptor: PropertyDescriptor
) => void;
