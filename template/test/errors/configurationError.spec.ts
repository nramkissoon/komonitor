import {} from "mocha";
import { ConfigurationError } from "./../../src/errors/configurationError";
import { expect } from "chai";

describe("ConfigurationError", () => {
  it("creates the correct message", () => {
    const givenValue = "1";
    const validValues = ["a", "b", "c"];
    const name = "test";
    const error = new ConfigurationError(givenValue, validValues, name);
    expect(error.name).to.equal(name);
    expect(error.message).to.equal(
      `Invalid configuration value '${givenValue}'. Value must be one of ${validValues.toString()}`
    );
  });
});
