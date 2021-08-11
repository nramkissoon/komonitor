// This module contains a decorator for measuring and logging method latency.

import { performance } from "perf_hooks";
import { Metrics } from "../metrics";
import { METHOD_LATENCY } from "../monitoringConstants";

export const logMethodLatency =
  (metrics: Metrics) =>
  (
    target: Object,
    propertyKey: string,
    descriptor: PropertyDescriptor
  ): any => {
    const method = descriptor.value;

    descriptor.value = (...args: any) => {
      const start = performance.now();
      const methodResult = method.apply(this, args);
      const finish = performance.now();
      metrics.addProperty(METHOD_LATENCY, finish - start);
      metrics.emit();
      return methodResult;
    };

    return descriptor;
  };
