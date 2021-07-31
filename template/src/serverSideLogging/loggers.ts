import { Logger } from "./logging";

// Simple console logger
export class ConsoleLogger implements Logger {
  log = (logLine: string) => {
    console.log(logLine);
  };
}
