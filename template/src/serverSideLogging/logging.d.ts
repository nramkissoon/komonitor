export interface Logger {
  log: (logLine: string) => void;
}

export type LogLevel = "info" | "warn" | "error";

export interface LogLineComponents {
  tag: string;
  level: LogLevel;
  value: string | number | boolean;
  timestamp?: string;
  parameters?: Object;
}

export class Metrics {
  loggers: Logger[];
  constructor(loggers: Logger[]): void;
  async log(logLineComponents: LogLineComponents): void;
}

export type MethodMetricLoggingDecorator = (
  metrics: Metrics
) => (
  target: Object,
  propertyKey: string,
  descriptor: PropertyDescriptor
) => void;
