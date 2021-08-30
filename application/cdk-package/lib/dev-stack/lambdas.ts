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
      key: string;
      //alertLambda: AlertLambda;
      region: string;
    }
  ) {
    super(scope, id);

    this.lambda = new lambda.Function(this, "dev_uptime_check", {
      runtime: lambda.Runtime.NODEJS_14_X,
      handler: "index.handler",
      code: lambda.Code.fromBucket(props.lambdaCodeIBucket, props.key),
      environment: {
        REGION: props.region,
        MONITOR_STATUS_TABLE_NAME: props.monitorStatusTable.tableName,
        //ALERT_LAMBDA: props.alertLambda.lambda.functionArn,
      },
      timeout: cdk.Duration.seconds(60),
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

    //props.alertLambda.lambda.grantInvoke(this.lambda);
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
      region: string;
      monitorTable: dynamodb.Table;
    }
  ) {
    super(scope, id);

    this.lambda = new lambda.Function(this, "dev_uptime_check", {
      runtime: lambda.Runtime.NODEJS_14_X,
      handler: "index.handler",
      code: lambda.Code.fromBucket(
        props.lambdaCodeIBucket,
        "uptime-check-job-runner-lambda-package.zip"
      ),
      environment: {
        REGION: props.region,
        LAMBDA_ARN: props.uptimeCheckLambda.lambda.functionArn,
      },
      timeout: cdk.Duration.minutes(5),
    });

    // allow the check lambda to be able to be invoked by the job runner
    props.uptimeCheckLambda.lambda.grantInvoke(this.lambda);
    // allow job runner to be able to read monitors
    props.monitorTable.grantReadData(this.lambda);
  }
}

class AlertLambda extends cdk.Construct {
  public readonly lambda: lambda.Function;
  constructor(
    scope: cdk.Construct,
    id: string,
    props: {
      lambdaCodeIBucket: s3.IBucket;
      monitorStatusTable: dynamodb.Table;
      uptimeCheckLambdaBucketUrl: string;
    }
  ) {
    super(scope, id);

    this.lambda = new lambda.Function(this, "dev_uptime_check", {
      runtime: lambda.Runtime.NODEJS_14_X,
      handler: "index.handler",
      code: lambda.Code.fromBucket(
        props.lambdaCodeIBucket,
        "alert-lambda-package.zip"
      ),
      environment: {
        MONITOR_STATUS_TABLE_NAME: props.monitorStatusTable.tableName,
      },
      timeout: cdk.Duration.minutes(1),
    });

    props.monitorStatusTable.grantReadData(this.lambda);
  }
}

export class DevStackLambdas extends cdk.Construct {
  public readonly uptimeCheckLambda: UptimeCheckLambda;
  public readonly alertLambda: AlertLambda;
  public readonly uptimeCheckJobRunnerLambda: UptimeCheckJobRunnerLambda;
  public readonly uptimeCheckLambdaCodeIBucket: s3.IBucket;

  constructor(
    scope: cdk.Construct,
    id: string,
    props: {
      monitorStatusTable: dynamodb.Table;
      region: string;
      uptimeCheckLambdaBucketName: string;
      uptimeCheckLambdaBucketKey: string;
    }
  ) {
    super(scope, id);

    this.uptimeCheckLambdaCodeIBucket = s3.Bucket.fromBucketAttributes(
      this,
      "dev_lambda_code_bucket",
      { bucketName: props.uptimeCheckLambdaBucketName }
    );

    // this.alertLambda = new AlertLambda(this, "alert_lambda", {
    //   lambdaCodeIBucket: this.lambdaCodeIBucket,
    //   monitorStatusTable: props.monitorStatusTable,
    // });

    this.uptimeCheckLambda = new UptimeCheckLambda(
      this,
      "dev_uptime_check_lambda",
      {
        monitorStatusTable: props.monitorStatusTable,
        lambdaCodeIBucket: this.uptimeCheckLambdaCodeIBucket,
        key: props.uptimeCheckLambdaBucketKey,
        region: props.region,
        //alertLambda: this.alertLambda,
      }
    );
  }
}
