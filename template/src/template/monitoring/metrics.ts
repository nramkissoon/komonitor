import { Logger } from "./logging/logging";

export class Metrics {
  loggers: Logger[];
  counts: { [key: string]: number };
  properties: { [key: string]: string | number | any };

  constructor(loggers: Logger[]) {
    this.loggers = loggers;
    this.counts = {};
    this.properties = {};
  }

  incrementCount = (metricName: string, count?: number) => {
    if (count) {
      if (!this.counts[metricName]) this.counts[metricName] = count;
      else this.counts[metricName] += count;
    } else {
      if (!this.counts[metricName]) this.counts[metricName] = 1;
      else this.counts[metricName] += 1;
    }
  };

  addProperty = (name: string, value: string | number) => {
    this.properties[name] = value;
  };

  emit = async (message?: string) => {
    const utcTimeComponent: string = new Date().toISOString();
    this.loggers.forEach((logger) => {
      try {
        logger.log({
          timestamp: utcTimeComponent,
          message: message,
          properties: this.properties,
          counts: this.counts,
        });
      } catch (err) {
        // console log the error and move on
        console.error((err as Error).message);
      }
    });

    // reset counts because we don't want to double count
    this.counts = {};
  };
}
