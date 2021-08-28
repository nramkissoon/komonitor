import * as cdk from "@aws-cdk/core";
import * as lambda from "@aws-cdk/aws-lambda";
import * as s3 from "@aws-cdk/aws-s3";
import * as dynamodb from "@aws-cdk/aws-dynamodb";
import * as iam from "@aws-cdk/aws-iam";

class UptimeCheckLambda extends cdk.Construct {
  public readonly lambda: lambda.Function;

  constructor(
    scope: cdk.Construct,
    id: string,
    props: {
      monitorStatusTable: dynamodb.Table;
      lambdaCodeIBucket: s3.IBucket;
      region: string;
    }
  ) {
    super(scope, id);

    this.lambda = new lambda.Function(this, "dev_uptime_check", {
      runtime: lambda.Runtime.NODEJS_14_X,
      handler: "index.handler",
      code: lambda.Code.fromBucket(
        props.lambdaCodeIBucket,
        "uptime-check-lambda-package.zip"
      ),
      environment: {
        REGION: props.region,
        MONITOR_STATUS_TABLE_NAME: props.monitorStatusTable.tableName,
      },
    });

    const monitorStatusDbWritePolicyStatement = new iam.PolicyStatement({
      resources: [props.monitorStatusTable.tableArn],
      effect: iam.Effect.ALLOW,
      actions: [
        "dynamodb:BatchWriteItem",
        "dynamodb:PutItem",
        "dynamodb:UpdateItem",
      ],
    });
    const monitorStatusDbWritePolicy = new iam.Policy(
      this,
      "dev_monitor_status_db_write_policy",
      {
        statements: [monitorStatusDbWritePolicyStatement],
      }
    );

    this.lambda.role?.attachInlinePolicy(monitorStatusDbWritePolicy);
  }
}

class UptimeCheckJobRunnerLambda extends cdk.Construct {
  public readonly lambda: lambda.Function;
  constructor(
    scope: cdk.Construct,
    id: string,
    props: {
      uptimeCheckLambda: UptimeCheckLambda;
      lambdaCodeIBucket: s3.IBucket;
    }
  ) {
    super(scope, id);
  }
}

export class DevStackLambdas extends cdk.Construct {
  public readonly uptimeCheckLambda: UptimeCheckLambda;
  public readonly lambdaCodeIBucket: s3.IBucket;

  constructor(
    scope: cdk.Construct,
    id: string,
    props: { monitorStatusTable: dynamodb.Table; region: string }
  ) {
    super(scope, id);

    this.lambdaCodeIBucket = s3.Bucket.fromBucketArn(
      this,
      "dev_lambda_code_bucket",
      "arn:aws:s3:::dev-ono"
    );

    this.uptimeCheckLambda = new UptimeCheckLambda(
      this,
      "dev_uptime_check_lambda",
      {
        monitorStatusTable: props.monitorStatusTable,
        lambdaCodeIBucket: this.lambdaCodeIBucket,
        region: props.region,
      }
    );
  }
}
