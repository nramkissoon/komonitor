import * as cdk from "@aws-cdk/core";
import { DevStackDdbTables } from "./ddb-tables";
import { DevStackLambdas } from "./lambdas";

export class DevStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props: cdk.StackProps) {
    super(scope, id, props);

    const DdbTables = new DevStackDdbTables(this, "dev_tables", {});
    const lambdas = new DevStackLambdas(this, "dev_lambdas", {
      monitorStatusTable: DdbTables.uptimeMonitorStatusTable,
      region: props.env?.region || "us-east-1", // dev is always us-east-1 anyways
    });
  }
}
