import { performance } from "perf_hooks";
import { runJob } from "./run-job";
import { getJobs } from "./utils";

export const handler = async (event: any) => {
  try {
    const start = performance.now();
    let jobs = getJobs(event);

    const jobPromises = [];
    for (let job of jobs) {
      if (!job.paused) {
        jobPromises.push(runJob(job));
      }
    }
    const allSettled = await Promise.allSettled(jobPromises);
    const end = performance.now();
    return {
      statusCode: 200,
      latency: end - start,
      jobs: jobs.length,
    };
  } catch (err) {
    console.log(err);
  }
};
