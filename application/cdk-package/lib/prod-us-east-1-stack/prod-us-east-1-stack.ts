import * as cdk from "@aws-cdk/core";
import { StackProps, Tags } from "@aws-cdk/core";
import { ProdDdbTables } from "./dynamo-db-tables";

export interface DevStackProps extends StackProps {
  lambdaCodeBucketName: string;
  uptimeCheckLambdaBucketKey: string;
  jobRunnerLambdaBucketKey: string;
  alertLambdaBucketKey: string;
}

export class ProdUsEast1Stack extends cdk.Stack {
  public readonly tables: ProdDdbTables;

  constructor(scope: cdk.Construct, id: string, props: DevStackProps) {
    super(scope, id, props);

    Tags.of(this).add("application", "komonitor");
    Tags.of(this).add("environment", "production");

    this.tables = new ProdDdbTables(this, "prod_tables", {});
  }
}
