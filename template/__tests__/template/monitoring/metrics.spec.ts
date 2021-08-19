import sinon from "sinon";
import { ConsoleLogger } from "../../../src/template/monitoring/logging/loggers";
import { Metrics } from "../../../src/template/monitoring/metrics";

const consoleLoggerStub1 = sinon.stub(new ConsoleLogger());
const consoleLoggerStub2 = sinon.stub(new ConsoleLogger());

describe("Metrics", () => {
  afterEach(() => {
    consoleLoggerStub1.log.reset();
    consoleLoggerStub2.log.reset();
  });
  describe("constructor", () => {
    it("sets class variables", () => {
      const metrics = new Metrics([consoleLoggerStub1]);
      expect(metrics.counts).toEqual({});
      expect(metrics.properties).toEqual({});
      expect(metrics.loggers).toEqual([consoleLoggerStub1]);
    });
  });
  describe("incrementCount", () => {
    it("initializes count correctly", () => {
      const metrics = new Metrics([consoleLoggerStub1]);
      metrics.incrementCount("test1");
      expect(metrics.counts["test1"]).toEqual(1);

      metrics.incrementCount("test2", 3);
      expect(metrics.counts["test2"]).toEqual(3);
    });
    it("updates count correctly", () => {
      const metrics = new Metrics([consoleLoggerStub1]);
      metrics.incrementCount("test1");
      metrics.incrementCount("test1");
      expect(metrics.counts["test1"]).toEqual(2);

      metrics.incrementCount("test2");
      metrics.incrementCount("test2", 3);
      expect(metrics.counts["test2"]).toEqual(4);
    });
  });
  describe("addProperty", () => {
    it("sets property", () => {
      const metrics = new Metrics([consoleLoggerStub1]);
      metrics.addProperty("test", 1);
      expect(metrics.properties["test"]).toEqual(1);
    });
    it("overrides already set property", () => {
      const metrics = new Metrics([consoleLoggerStub1]);
      metrics.addProperty("test", 1);
      metrics.addProperty("test", "a");
      expect(metrics.properties["test"]).toEqual("a");
    });
  });
  describe("emit", () => {
    it("resets counts", async () => {
      const metrics = new Metrics([consoleLoggerStub1]);
      metrics.incrementCount("test1");

      await metrics.emit();
      expect(metrics.counts).toEqual({});
    });

    it("catches error from logger", async () => {
      const consoleSpy = sinon.spy(console, "error");
      consoleLoggerStub1.log.throws("error");
      const metrics = new Metrics([consoleLoggerStub1]);

      await metrics.emit();
      expect(consoleSpy.callCount).toEqual(1);

      console.error.restore();
    });
    it("calls each logger's log function", async () => {
      const metrics = new Metrics([consoleLoggerStub1, consoleLoggerStub2]);
      await metrics.emit();
      expect(consoleLoggerStub1.log.callCount).toBe(1);
      expect(consoleLoggerStub2.log.callCount).toBe(1);
    });
  });
});
