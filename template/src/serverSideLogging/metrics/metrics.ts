import { Logger } from "../logger";

export interface LogLineComponents {
  tag: string;
  level: "info" | "warn" | "error";
  value: any;
  timestamp?: string;
  other?: any;
}

/**
 * This class contains the logic for logging metrics to user defined output channels.
 * The constructor takes in an array of logging implementations that the user wants to use.
 * The log() method takes in a string array to log and logs it to all the desired outputs asynchronously to avoid blocking.
 */
export class Metrics {
  private loggers: Logger[] = [];

  constructor(loggers: Logger[]) {
    this.loggers = loggers;
  }

  log = async (logLineComponents: LogLineComponents) => {
    const utcTimeComponent: string = new Date().toISOString();
    logLineComponents.timestamp = utcTimeComponent;
    this.loggers.forEach((logger) => {
      logger.log(JSON.stringify(logLineComponents));
    });
  };
}
