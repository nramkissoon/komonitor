import { randomUUID } from "crypto";
import {
  Logger,
  LogLineComponents,
  LogLineComponentsData,
  Metrics,
  MetricsPrefix,
  MetricsPrefixData,
} from "../logging";

/**
 * This class contains the logic for logging metrics to user defined output channels.
 * The constructor takes in an array of logging implementations that the user wants to use.
 * The log() method takes in a string array to log and logs it to all the desired outputs asynchronously to avoid blocking.
 */
export class MetricsImpl implements Metrics {
  loggers: Logger[];
  prefix: MetricsPrefix;

  constructor(loggers: Logger[], metricsPrefixData?: MetricsPrefixData) {
    this.loggers = loggers;

    const metricsId: string = randomUUID();
    this.prefix = {
      metricsId,
      ...metricsPrefixData,
    };
  }

  log = async (logLineComponentsData: LogLineComponentsData) => {
    const utcTimeComponent: string = new Date().toISOString();
    const logLineComponents: LogLineComponents = {
      timestamp: utcTimeComponent,
      ...logLineComponentsData,
    };
    this.loggers.forEach((logger) => {
      try {
        logger.log(logLineComponents);
      } catch (err) {
        // console log the error and move on
        console.error((err as Error).message);
      }
    });
  };
}
