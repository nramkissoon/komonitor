import { getJobs } from "./utils";
import dotenv from "dotenv";
import { runJob } from "./run-job";
import { performance } from "perf_hooks";

export const handler = async (event: any) => {
  const start = performance.now();
  dotenv.config();
  let jobs = getJobs(event);

  await Promise.allSettled(jobs.map((job) => runJob(job)));
  const end = performance.now();
  return {
    statusCode: 200,
    latency: end - start,
  };
};
