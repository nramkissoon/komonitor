import { performance } from "perf_hooks";

export const handler = async (event: any) => {
  const start = performance.now();

  if (event.monitorId !== undefined && event.ownerId !== undefined) {
  } else {
    // TODO log invalid event
    console.log("invalid event");
  }

  const end = performance.now();
  return {
    statusCode: 200,
    latency: end - start,
  };
};
