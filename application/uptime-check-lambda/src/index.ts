import { getJobs } from "./utils";
import { runJob } from "./run-job";
import { performance } from "perf_hooks";

export const handler = async (event: any) => {
  const start = performance.now();
  let jobs = getJobs(event);

  const jobPromises = [];
  for (let job of jobs) {
    jobPromises.push(runJob(job));
  }
  await Promise.allSettled(jobPromises);
  const end = performance.now();
  return {
    statusCode: 200,
    latency: end - start,
    jobs: jobs.length,
  };
};
