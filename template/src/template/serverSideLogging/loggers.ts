import { Logger } from "./logging";
import fs from "fs";
import { LoggingError } from "./loggingError";

// Simple console logger
export class ConsoleLogger implements Logger {
  log = (logLine: Object) => {
    try {
      console.log(JSON.stringify(logLine));
    } catch (err) {
      throw new LoggingError("Console", (err as Error).message);
    }
  };
}

// File logger
export class FileLogger implements Logger {
  log = () => {};
}
