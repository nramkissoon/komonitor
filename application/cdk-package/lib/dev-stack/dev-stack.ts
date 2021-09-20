import * as cdk from "@aws-cdk/core";
import { StackProps, Tags } from "@aws-cdk/core";
import { DevStackDdbTables } from "./ddb-tables";
import { ScheduleRules } from "./events";
import { DevStackLambdas } from "./lambdas";

export interface DevStackProps extends StackProps {
  lambdaCodeBucketName: string;
  uptimeCheckLambdaBucketKey: string;
  jobRunnerLambdaBucketKey: string;
}

export class DevStack extends cdk.Stack {
  public readonly tables: DevStackDdbTables;
  public readonly lambdas: DevStackLambdas;
  public readonly events: ScheduleRules;
  constructor(scope: cdk.Construct, id: string, props: DevStackProps) {
    super(scope, id, props);

    Tags.of(this).add("application", "ono");
    Tags.of(this).add("environment", "development");

    this.tables = new DevStackDdbTables(this, "dev_tables", {});
    this.lambdas = new DevStackLambdas(this, "dev_lambdas", {
      uptimeCheckMonitorStatusTable: this.tables.uptimeMonitorStatusTable,
      uptimeCheckMonitorTable: this.tables.uptimeMonitorTable,
      uptimeCheckMonitorTableFrequencyGsiName:
        this.tables.uptimeCheckMonitorTableFrequencyGsiName,
      region: props.env?.region || "us-east-1", // dev is always us-east-1 anyways
      lambdaCodeBucketName: props.lambdaCodeBucketName,
      uptimeCheckLambdaBucketKey: props.uptimeCheckLambdaBucketKey,
      jobRunnerLambdaBucketKey: props.jobRunnerLambdaBucketKey,
    });

    this.events = new ScheduleRules(this, "Events", {
      jobRunnerLambda: this.lambdas.jobRunnerLambda.lambda,
    });
  }
}
