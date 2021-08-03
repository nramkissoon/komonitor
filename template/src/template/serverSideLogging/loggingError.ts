export class LoggingError extends Error {
  constructor(loggerType: string, message: string) {
    super();
    this.name = "Logging Error";
    this.message = `Error Occurred for ${loggerType} logger: ${message}`;
  }
}
