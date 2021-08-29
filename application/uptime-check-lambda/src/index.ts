import { getJobs } from "./utils";
import { runJob } from "./run-job";
import { performance } from "perf_hooks";

export const handler = async (event: any) => {
  const start = performance.now();
  let jobs = getJobs(event);

  for (let job of jobs) {
    await runJob(job);
  }
  const end = performance.now();
  return {
    statusCode: 200,
    latency: end - start,
  };
};
