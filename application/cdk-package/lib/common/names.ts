import * as _ from "lodash";

export const LAMBDA_CODE_DEV_BUCKET = "komonitor-dev-lambda-code-bucket";
export const UPTIME_CHECK_LAMBDA_CODE_KEY = "lambda-uptime-check/package.zip";
export const JOB_RUNNER_LAMBDA_CODE_KEY = "lambda-job-runner/package.zip";
export const ALERT_LAMBDA_CODE_KEY = "lambda-alert/package.zip";
export const WEEKLY_REPORT_LAMBDA_CODE_KEY = "lambda-weekly-alert/package.zip";

export const DEV_STACK = {
  UPTIME_CHECK_LAMBDA: "devStackUptimeCheckLambda",
  JOB_RUNNER_LAMBDA: "devStackJobRunnerLambda",
  ALERT_LAMBDA: "devStackAlertLambda",
  WEEKLY_REPORT_LAMBDA: "devWeeklyReportLambda",
};

export function prodLambdaName(
  region: string,
  type: "uptime" | "jobrunner" | "alert" | "weeklyReport"
) {
  if (type === "alert") {
    return _.camelCase(region) + "ProdAlertLambda";
  } else if (type === "jobrunner") {
    return _.camelCase(region) + "ProdJobRunnerLambda";
  } else if (type === "weeklyReport") {
    return _.camelCase(region) + "ProdWeeklyReportLambda";
  } else {
    return _.camelCase(region) + "ProdUptimeMonitorLambda";
  }
}

export function prodStageName(region: string) {
  const cc = _.camelCase(region);
  return "Prod" + cc.charAt(0).toUpperCase() + cc.slice(1) + "StackStage";
}

export function prodLambdaCodeBucketName(region: string) {
  return region + "-prod-lambda-code-bucket-komonitor";
}
