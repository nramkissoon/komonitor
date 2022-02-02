import jsonpath from "jsonpath";
import {
  CodeCheck,
  HtmlBodyCheck,
  JsonBodyCheck,
  JsonOperators,
  LatencyCheck,
  NumericalOperators,
  UpConditionCheck,
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

export const runUpConditionChecks = (
  conditions: UpConditionCheck[],
  response: UptimeStatusResponse
) => {
  try {
    let passed = true;
    let check;
    for (let condition of conditions) {
      switch (condition.type) {
        case "code":
          check = condition.condition as CodeCheck;
          passed = passed && codeCheckPassed(check, response);
          break;
        case "latency":
          check = condition.condition as LatencyCheck;
          passed = passed && latencyCheckPassed(check, response);
          break;
        case "html_body":
          check = condition.condition as HtmlBodyCheck;
          passed = passed && htmlBodyCheckPassed(check, response);
          break;
        case "json_body":
          break;
        default:
          break;
      }
    }
    return passed;
  } catch (err) {
    console.log(err);
    return false;
  }
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

export const jsonComparison = (
  value: any,
  operator: JsonOperators,
  expected: any
) => {
  try {
    switch (operator) {
      case "equal":
        return value === expected;
      case "greater":
        return value > expected;
      case "less":
        return value < expected;
      case "greater_or_equal":
        return value >= expected;
      case "less_or_equal":
        return value <= expected;
      case "not_equal":
        return value !== expected;
      case "null":
        return value === null;
      case "not_null":
        return value !== expected;
      case "empty":
        return value === "";
      case "not_empty":
        return value !== "" && typeof value === "string";
      case "contains":
        return typeof value === "string" && value.includes(expected);
      case "not_contains":
        return typeof value === "string" && !value.includes(expected);
    }
  } catch (err) {
    console.log(err);
    throw err;
  }
};

export const jsonBodyCheckPassed = (
  { comparison, expected, property, expectedBodyContentType }: JsonBodyCheck,
  response: UptimeStatusResponse
) => {
  if (
    !response.headers["content-type"] ||
    response.headers["content-type"].includes(expectedBodyContentType)
  ) {
    return false;
  }

  try {
    const value = jsonpath.value(response.body, property);
    return jsonComparison(value, comparison, expected);
  } catch (err) {
    return false;
  }
};

export const htmlBodyCheckPassed = (
  { comparison, expected, expectedBodyContentType }: HtmlBodyCheck,
  response: UptimeStatusResponse
) => {
  if (
    !response.headers["content-type"] ||
    response.headers["content-type"].includes(expectedBodyContentType)
  ) {
    return false;
  }

  if (comparison === "contains")
    return (response.body as string).includes(expected);
  if (comparison === "not_contains")
    return !(response.body as string).includes(expected);
  return false;
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
