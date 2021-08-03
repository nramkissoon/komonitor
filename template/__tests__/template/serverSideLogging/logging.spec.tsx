import { LoggingError } from "../../../src/template/serverSideLogging/loggingError";

describe("Logging Error", () => {
  it("message is correct", () => {
    const error = new LoggingError('test', 'message')
    expect(error.message).toEqual('Error Occurred for test logger: message')
  })
})