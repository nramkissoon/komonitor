import { UptimeMonitorJob } from "project-types";

// reads event object for any valid jobs
export const getJobs = (event: any): UptimeMonitorJob[] => {
  if (!event.jobs) {
    return [];
  }

  const jobs: UptimeMonitorJob[] = [];
  event.jobs.forEach((job: any) => {
    if (
      job.monitor_id &&
      job.owner_id &&
      job.url &&
      job.name &&
      job.region &&
      job.retries !== undefined
    ) {
      jobs.push(job);
    }
  });

  return jobs;
};
