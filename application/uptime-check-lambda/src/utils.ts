import * as crypto from "crypto";
import * as jsonpath from "jsonpath";
import {
  CodeCheck,
  HtmlBodyCheck,
  JsonBodyCheck,
  JsonOperators,
  LatencyCheck,
  NumericalOperators,
  UpConditionCheck,
  UpConditionCheckResult,
  UptimeMonitor,
  UptimeMonitorStatus,
  UptimeStatusResponse,
  WebhookSecret,
} from "utils";

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
): { isUp: boolean; conditionCheckResults: UpConditionCheckResult[] } => {
  try {
    let allPassed = true;
    let check;
    const result = {
      isUp: true,
      conditionCheckResults: [] as UpConditionCheckResult[],
    };
    for (let condition of conditions) {
      switch (condition.type) {
        case "code":
          check = condition.condition as CodeCheck;
          let { passed, value } = codeCheckPassed(check, response);
          allPassed = allPassed && passed;
          result.conditionCheckResults.push({
            passed: passed,
            check: condition as UpConditionCheck,
            value: value,
          });
          break;
        case "latency":
          check = condition.condition as LatencyCheck;
          let { passed: lp, value: vp } = latencyCheckPassed(check, response);
          allPassed = allPassed && lp;
          result.conditionCheckResults.push({
            passed: lp,
            check: condition as UpConditionCheck,
            value: vp,
          });
          break;
        case "html_body":
          check = condition.condition as HtmlBodyCheck;
          let { passed: hp, value: hv } = htmlBodyCheckPassed(check, response);
          allPassed = allPassed && hp;
          result.conditionCheckResults.push({
            passed: hp,
            check: condition as UpConditionCheck,
            value: null,
          });
          break;
        case "json_body":
          check = condition.condition as JsonBodyCheck;
          let { passed: jp, value: jv } = jsonBodyCheckPassed(check, response);
          allPassed = allPassed && jp;
          result.conditionCheckResults.push({
            passed: jp,
            check: condition as UpConditionCheck,
            value: jv,
          });
          break;
        default:
          break;
      }
    }
    result.isUp = allPassed;
    return result;
  } catch (err) {
    console.log(err);
    return { isUp: false, conditionCheckResults: [] };
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
    return { passed: false, value: "wrong content-type header" };
  }

  try {
    const value = jsonpath.value(response.body, property);
    return {
      passed: jsonComparison(value, comparison, expected),
      value: value,
    };
  } catch (err) {
    return { passed: false, value: "unknown error" };
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
    return { passed: false, value: "wrong content-type header" };
  }

  if (comparison === "contains")
    return {
      passed: (response.body as string).includes(expected),
      value: response.body as string,
    };
  if (comparison === "not_contains")
    return {
      passed: !(response.body as string).includes(expected),
      value: response.body as string,
    };
  return { passed: false, value: "unknown error" };
};

export const latencyCheckPassed = (
  { property, comparison, expected }: LatencyCheck,
  response: UptimeStatusResponse
) => {
  if (response.timings.phases[property] === undefined) {
    return { passed: false, value: null };
  }
  return {
    passed: numericComparison(
      response.timings.phases[property] as number,
      comparison,
      expected
    ),
    value: response.timings.phases[property] as number,
  };
};

export const codeCheckPassed = (
  { comparison, expected }: CodeCheck,
  response: UptimeStatusResponse
) => {
  return {
    passed: numericComparison(response.statusCode, comparison, expected),
    value: response.statusCode,
  };
};

export const createUptimeStatusSignature = (
  data: { type: string; data: UptimeMonitorStatus },
  secret: WebhookSecret
) => {
  const hmac = crypto.createHmac("sha256", secret.value);
  hmac.update(JSON.stringify(data), "utf-8");
  return hmac.digest("hex");
};
