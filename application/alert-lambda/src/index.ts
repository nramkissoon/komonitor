import { performance } from "perf_hooks";
import { MonitorTypes } from "project-types";
import { handleUptimeMonitor } from "./monitor-handlers";

export const handler = async (event: any) => {
  const start = performance.now();
  try {
    if (
      event.monitorId !== undefined &&
      event.ownerId !== undefined &&
      event.monitorType !== undefined
    ) {
      if ((event.monitorType as MonitorTypes) === "uptime-monitor") {
        await handleUptimeMonitor(
          event.monitorId as string,
          event.ownerId as string
        );
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
