import { UptimeMonitorJob } from "types";

export const getJobs = (event: any): UptimeMonitorJob[] => {
  if (!event.jobs) {
    return [];
  }

  const jobs: UptimeMonitorJob[] = [];
  event.jobs.forEach((job: any) => {
    if (job.monitor_id && job.url && job.name && job.region && job.retries) {
      jobs.push(job);
      console.log(JSON.stringify(job));
    }
  });

  return jobs;
};
