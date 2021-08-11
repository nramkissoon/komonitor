import { randomUUID } from "crypto";
import { Metrics } from "../metrics";
import { REQUEST_ID } from "../monitoringConstants";

export const requestTagged =
  (metrics: Metrics) =>
  (
    target: Object,
    propertyKey: string,
    descriptor: PropertyDescriptor
  ): any => {
    const method = descriptor.value;

    descriptor.value = (...args: any) => {
      metrics.addProperty(REQUEST_ID, randomUUID());
      const methodResult = method.apply(this, args);
      return methodResult;
    };

    return descriptor;
  };
