import * as _ from "lodash";

export const LAMBDA_CODE_DEV_BUCKET = "komonitor-dev-lambda-code-bucket";
export const UPTIME_CHECK_LAMBDA_CODE_KEY = "lambda-uptime-check/package.zip";
export const JOB_RUNNER_LAMBDA_CODE_KEY = "lambda-job-runner/package.zip";
export const ALERT_LAMBDA_CODE_KEY = "lambda-alert/package.zip";

export const DEV_STACK = {
  UPTIME_CHECK_LAMBDA: "devStackUptimeCheckLambda",
  JOB_RUNNER_LAMBDA: "devStackJobRunnerLambda",
  ALERT_LAMBDA: "devStackAlertLambda",
};

export function prodLambdaName(
  region: string,
  type: "uptime" | "jobrunner" | "alert"
) {
  if (type === "alert") {
    return _.camelCase(region) + "ProdAlertLambda";
  } else if (type === "jobrunner") {
    return _.camelCase(region) + "ProdJobRunnerLambda";
  } else {
    return _.camelCase(region) + "ProdUptimeMonitorLambda";
  }
}

export function prodLambdaCodeBucketName(region: string) {
  return region + "-prod-lambda-code-bucket-komonitor";
}
