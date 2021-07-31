import { Logger, LogLineComponents, Metrics } from "../logging";

/**
 * This class contains the logic for logging metrics to user defined output channels.
 * The constructor takes in an array of logging implementations that the user wants to use.
 * The log() method takes in a string array to log and logs it to all the desired outputs asynchronously to avoid blocking.
 */
export class MetricsImpl implements Metrics {
  loggers: Logger[];

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
