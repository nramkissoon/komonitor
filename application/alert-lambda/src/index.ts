import { performance } from "perf_hooks";
import { MonitorTypes } from "project-types";

export const handler = async (event: any) => {
  const start = performance.now();
  try {
    if (
      event.monitorId !== undefined &&
      event.ownerId !== undefined &&
      event.monitorType !== undefined
    ) {
      let monitor;
      let statuses;
      if ((event.monitorType as MonitorTypes) === "uptime-monitor") {
      }
    } else {
      // TODO log invalid event
      console.log("invalid event");
    }
  } catch (err) {
    console.error(err);
  }

  const end = performance.now();
  return {
    statusCode: 200,
    latency: end - start,
  };
};
