// This file contains supported logging implementations that can be added to by the user.

export interface Logger {
  log: (logLine: string) => void;
}

// Simple console logger
export class ConsoleLogger implements Logger {
  log = (logLine: string) => {
    console.log(logLine);
  };
}
