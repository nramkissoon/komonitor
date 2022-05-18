export interface LambdaCodeBucketProps {
  bucketName: string;
  uptimeCheckLambdaCodeObjectKey: string;
  jobRunnerLambdaCodeObjectKey: string;
  alertLambdaCodeObjectKey: string;
  weeklyReportLambdaCodeObjectKey: string;
}
