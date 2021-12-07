export interface Config {
  region: string;
  uptimeCheckMonitorTableName: string;
  uptimeCheckMonitorTableFrequencyGsiName: string;
  uptimeCheckLambdaName: string;
  uptimeCheckLambdaJobLimit: number;
  lighthouseJobTableName: string;
  lighthouseJobTableFrequencyGsiName: string;
}

export const config: Config = {
  region: process.env.REGION || "us-east-1",
  uptimeCheckMonitorTableName:
    process.env.UPTIME_CHECK_MONITOR_TABLE_NAME || "",
  uptimeCheckMonitorTableFrequencyGsiName:
    process.env.UPTIME_CHECK_MONITOR_TABLE_FREQUENCY_GSI_NAME || "",
  uptimeCheckLambdaName: process.env.UPTIME_CHECK_LAMBDA_NAME || "",
  uptimeCheckLambdaJobLimit: 200,
  lighthouseJobTableFrequencyGsiName:
    process.env.LIGHTHOUSE_JOB_TABLE_FREQUENCY_GSI_NAME || "",
  lighthouseJobTableName: process.env.LIGHTHOUSE_JOB_TABLE_NAME || "",
};
