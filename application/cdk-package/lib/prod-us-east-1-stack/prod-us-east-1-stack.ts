import * as cdk from "@aws-cdk/core";
import { StackProps, Tags } from "@aws-cdk/core";
import { CommonConstruct } from "../prod-stack-common/common-construct";
import { ProdDdbTables } from "./dynamo-db-tables";

export interface ProdUsEast1StackProps extends StackProps {
  lambdaCodeBucketName: string;
  uptimeCheckLambdaBucketKey: string;
  jobRunnerLambdaBucketKey: string;
  alertLambdaBucketKey: string;
}

export class ProdUsEast1Stack extends cdk.Stack {
  public tables: ProdDdbTables;
  public readonly commonConstruct: CommonConstruct;

  constructor(scope: cdk.Construct, id: string, props: ProdUsEast1StackProps) {
    super(scope, id, props);

    Tags.of(this).add("application", "komonitor");
    Tags.of(this).add("environment", "production");

    this.tables = new ProdDdbTables(this, "prod_tables", {});

    this.commonConstruct = new CommonConstruct(this, "prodCommonConstruct", {
      lambdaCodeBucketName: props.lambdaCodeBucketName,
      uptimeLambdaBucketKey: props.uptimeCheckLambdaBucketKey,
      jobRunnerLambdaBucketKey: props.jobRunnerLambdaBucketKey,
      alertLambdaBucketKey: props.alertLambdaBucketKey,
      region: props.env?.region as string,
      uptimeMonitorStatusTable: this.tables.uptimeMonitorStatusTable,
      uptimeMonitorTableFrequencyGsiName:
        this.tables.uptimeMonitorTableFrequencyGsiName,
      uptimeMonitorTable: this.tables.uptimeMonitorTable,
      alertTable: this.tables.alertTable,
      userTable: this.tables.userTable,
      alertInvocationTable: this.tables.alertInvocationTable,
      alertInvocationTableTimestampLsiName:
        this.tables.alertInvocationTableTimestampLsiName,
    });
  }
}
