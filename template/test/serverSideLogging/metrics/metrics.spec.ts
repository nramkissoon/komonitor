import {} from "mocha";
import { Metrics } from "../../../src/serverSideLogging/metrics/metrics";
import { ConsoleLogger } from "../../../src/serverSideLogging/logger";
import * as sinon from "sinon";

describe("Metrics", () => {
  it("logger.log() called exactly once per logger", () => {
    const logger = new ConsoleLogger();
    const loggerMock = sinon.mock(logger);
    loggerMock.expects("log").once();

    const metrics: Metrics = new Metrics([logger]);
    metrics.log({ tag: "TEST", level: "info", value: 1 });

    loggerMock.verify();
  });
});
