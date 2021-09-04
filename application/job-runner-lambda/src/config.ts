export interface Config {
  region: string;
  uptimeCheckMonitorTableName: string;
  uptimeCheckMonitorTableFrequencyGsiName: string;
  uptimeCheckLambdaName: string;
  uptimeCheckLambdaJobLimit: number;
}

export const config: Config = {
  region: process.env.REGION || "us-east-1",
  uptimeCheckMonitorTableName:
    process.env.UPTIME_CHECK_MONITOR_TABLE_NAME || "",
  uptimeCheckMonitorTableFrequencyGsiName:
    process.env.UPTIME_CHECK_MONITOR_TABLE_FREQUENCY_GSI_NAME || "",
  uptimeCheckLambdaName: process.env.UPTIME_CHECK_LAMBDA_NAME || "",
  uptimeCheckLambdaJobLimit: 200,
};
