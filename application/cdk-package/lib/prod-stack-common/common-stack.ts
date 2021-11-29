import * as cdk from "@aws-cdk/core";
import { StackProps, Tags } from "@aws-cdk/core";
import { CommonConstruct, CommonConstructProps } from "./common-construct";

export interface CommonStackProps extends StackProps, CommonConstructProps {}

export class CommonStack extends cdk.Stack {
  public commonConstruct: CommonConstruct;
  constructor(scope: cdk.Construct, id: string, props: CommonStackProps) {
    super(scope, id, props);

    Tags.of(this).add("application", "komonitor");
    Tags.of(this).add("environment", "production");

    this.commonConstruct = new CommonConstruct(this, "prodCommonConstruct", {
      region: props.region,
      lambdaCodeBucketName: props.lambdaCodeBucketName,
      alertLambdaBucketKey: props.alertLambdaBucketKey,
      alertInvocationTable: props.alertInvocationTable,
      alertInvocationTableTimestampLsiName:
        props.alertInvocationTableTimestampLsiName,
      alertTable: props.alertTable,
      uptimeLambdaBucketKey: props.uptimeLambdaBucketKey,
      uptimeMonitorStatusTable: props.uptimeMonitorStatusTable,
      uptimeMonitorTable: props.uptimeMonitorTable,
      uptimeMonitorTableFrequencyGsiName:
        props.uptimeMonitorTableFrequencyGsiName,
      userTable: props.userTable,
      jobRunnerLambdaBucketKey: props.jobRunnerLambdaBucketKey,
    });
  }
}
