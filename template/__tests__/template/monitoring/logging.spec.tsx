import { LoggingError } from "../../../src/template/monitoring/logging/loggingError";

describe("Logging Error", () => {
  it("message is correct", () => {
    const error = new LoggingError("test", "message");
    expect(error.message).toEqual("Error Occurred for test logger: message");
  });
});
