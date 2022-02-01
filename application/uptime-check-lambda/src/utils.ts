import {
  CodeCheck,
  LatencyCheck,
  NumericalOperators,
  UptimeMonitor,
  UptimeStatusResponse,
} from "project-types";

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

export const numericComparison = (
  value: number,
  operator: NumericalOperators,
  expected: number
) => {
  switch (operator) {
    case "equal":
      return value === expected;
    case "greater":
      return value > expected;
    case "greater_or_equal":
      return value >= expected;
    case "less":
      return value < expected;
    case "less_or_equal":
      return value <= expected;
    case "not_equal":
      return value !== expected;
  }
};

export const latencyCheckPassed = (
  { property, comparison, expected }: LatencyCheck,
  response: UptimeStatusResponse
) => {
  if (response.timings.phases[property] === undefined) {
    return false;
  }
  return numericComparison(
    response.timings.phases[property] as number,
    comparison,
    expected
  );
};

export const codeCheckPassed = (
  { comparison, expected }: CodeCheck,
  response: UptimeStatusResponse
) => {
  return numericComparison(response.statusCode, comparison, expected);
};
