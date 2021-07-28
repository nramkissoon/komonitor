export class ConfigurationError extends Error {
  constructor(
    givenValue: string,
    validValues: string[],
    configurationName: string
  ) {
    super();
    this.name = configurationName;
    this.message = `Invalid configuration value '${givenValue}'. Value must be one of ${validValues.toString()}`;
  }
}
