import * as dynamodb from "@aws-cdk/aws-dynamodb";
import { BlockPublicAccess, Bucket } from "@aws-cdk/aws-s3";
import * as cdk from "@aws-cdk/core";
import { Tags } from "@aws-cdk/core";
import { prodLambdaCodeBucketName } from "../common/names";
import { Lambdas } from "./lambdas";
import { ScheduleRules } from "./schedule-rules";

export interface CommonConstructProps {
  lambdaCodeBucketName: string;
  uptimeLambdaBucketKey: string;
  jobRunnerLambdaBucketKey: string;
  alertLambdaBucketKey: string;
  region: string;
  uptimeMonitorStatusTable: dynamodb.Table;
  uptimeMonitorTableFrequencyGsiName: string;
  uptimeMonitorTable: dynamodb.Table;
  alertTable: dynamodb.Table;
  userTable: dynamodb.Table;
  alertInvocationTable: dynamodb.Table;
  alertInvocationTableTimestampLsiName: string;
  lighthouseJobTable: dynamodb.Table;
  lighthouseJobTableFrequencyGsiName: string;
}

export class CommonConstruct extends cdk.Construct {
  public readonly lambdas: Lambdas;
  public readonly events: ScheduleRules;
  public readonly codeBucket: Bucket;
  constructor(scope: cdk.Construct, id: string, props: CommonConstructProps) {
    super(scope, id);

    Tags.of(this).add("application", "Komonitor");
    Tags.of(this).add("environment", "production");

    this.codeBucket = new Bucket(this, "LambdaCodeBucket", {
      blockPublicAccess: BlockPublicAccess.BLOCK_ALL,
      bucketName: prodLambdaCodeBucketName(props.region),
    });

    this.lambdas = new Lambdas(this, "lambdas", {
      uptimeMonitorStatusTable: props.uptimeMonitorStatusTable,
      uptimeMonitorTable: props.uptimeMonitorTable,
      uptimeMonitorTableFrequencyGsiName:
        props.uptimeMonitorTableFrequencyGsiName,
      alertTable: props.alertTable,
      alertInvocationTable: props.alertInvocationTable,
      region: props.region,
      lambdaCodeBucketName: props.lambdaCodeBucketName,
      userTable: props.userTable,
      alertInvocationTableTimeStampLsiName:
        props.alertInvocationTableTimestampLsiName,
      lighthouseJobTable: props.lighthouseJobTable,
      lighthouseJobTableFrequencyGsiName:
        props.lighthouseJobTableFrequencyGsiName,
    });

    this.events = new ScheduleRules(this, "Events", {
      jobRunnerLambda: this.lambdas.jobRunnerLambda.lambda,
      region: props.region,
    });
  }
}
