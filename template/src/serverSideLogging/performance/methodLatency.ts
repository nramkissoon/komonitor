// This module contains a decorator for measuring and logging method latency.

import { performance } from "perf_hooks";
import { Metrics } from "../metrics/metrics";
import { METHOD_LATENCY } from "../metrics/metricsConstants";

export const logMethodLatencyAsync =
  (metrics: Metrics, metadata?: any) =>
  (target: Object, propertyKey: string, descriptor: PropertyDescriptor) => {
    const method = descriptor.value;

    descriptor.value = async (...args: any) => {
      const start = performance.now();
      const methodResult = await method.apply(this, args);
      const finish = performance.now();
      metrics.log({
        level: "info",
        tag: METHOD_LATENCY,
        value: finish - start,
        other: metadata,
      });
      return methodResult;
    };
  };
