import * as cdk from "@aws-cdk/core";
import { StackProps } from "@aws-cdk/core";
import { DevStackDdbTables } from "./ddb-tables";
import { DevStackLambdas } from "./lambdas";

export interface DevStackProps extends StackProps {
  lambdaCodeBucketName: string;
  uptimeCheckLambdaBucketKey: string;
}

export class DevStack extends cdk.Stack {
  public readonly tables: DevStackDdbTables;
  public readonly lambdas: DevStackLambdas;
  constructor(scope: cdk.Construct, id: string, props: DevStackProps) {
    super(scope, id, props);

    this.tables = new DevStackDdbTables(this, "dev_tables", {});
    this.lambdas = new DevStackLambdas(this, "dev_lambdas", {
      monitorStatusTable: this.tables.uptimeMonitorStatusTable,
      region: props.env?.region || "us-east-1", // dev is always us-east-1 anyways
      uptimeCheckLambdaBucketName: props.lambdaCodeBucketName,
      uptimeCheckLambdaBucketKey: props.uptimeCheckLambdaBucketKey,
    });
  }
}
