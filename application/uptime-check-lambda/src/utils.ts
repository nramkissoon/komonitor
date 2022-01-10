import { UptimeMonitor } from "project-types";

// reads event object for any valid jobs
export const getJobs = (event: any): UptimeMonitor[] => {
  if (!event.jobs) {
    return [];
  }

  const jobs: UptimeMonitor[] = [];
  event.jobs.forEach((job: any) => {
    if (job.monitor_id && job.owner_id && job.url && job.name && job.region) {
      jobs.push(job);
    }
  });

  return jobs;
};
