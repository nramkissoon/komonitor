import { performance } from "perf_hooks";
import { MonitorTypes } from "utils";
import { handleUptimeMonitor } from "./monitor-handlers";

export const handler = async (event: any) => {
  const start = performance.now();
  try {
    if (
      event.monitorId !== undefined &&
      event.ownerId !== undefined &&
      event.monitorType !== undefined &&
      event.alertType !== undefined
    ) {
      if ((event.monitorType as MonitorTypes) === "uptime-monitor") {
        console.log("event: ", event);
        await handleUptimeMonitor(
          event.monitorId as string,
          event.ownerId as string,
          event.alertType as "incident_start" | "incident_end"
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
