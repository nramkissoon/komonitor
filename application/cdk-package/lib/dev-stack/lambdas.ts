import * as cdk from "@aws-cdk/core";
import * as lambda from "@aws-cdk/aws-lambda";
import * as s3 from "@aws-cdk/aws-s3";
import * as dynamodb from "@aws-cdk/aws-dynamodb";
import * as iam from "@aws-cdk/aws-iam";
import { DEV_STACK } from "../common/names";

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
      functionName: DEV_STACK.UPTIME_CHECK_LAMBDA,
      environment: {
        REGION: props.region,
        MONITOR_STATUS_TABLE_NAME: props.monitorStatusTable.tableName,
        //ALERT_LAMBDA: props.alertLambda.lambda.functionArn,
      },
      timeout: cdk.Duration.seconds(60),
      memorySize: 140,
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

class JobRunnerLambda extends cdk.Construct {
  public readonly lambda: lambda.Function;
  constructor(
    scope: cdk.Construct,
    id: string,
    props: {
      uptimeCheckLambda: UptimeCheckLambda;
      lambdaCodeIBucket: s3.IBucket;
      key: string;
      region: string;
      uptimeCheckMonitorTable: dynamodb.Table;
      uptimeCheckMonitorTableFrequencyGsiName: string;
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
      functionName: DEV_STACK.JOB_RUNNER_LAMBDA,
      environment: {
        REGION: props.region,
        UPTIME_CHECK_MONITOR_TABLE_NAME:
          props.uptimeCheckMonitorTable.tableName,
        UPTIME_CHECK_MONITOR_TABLE_FREQUENCY_GSI_NAME:
          props.uptimeCheckMonitorTableFrequencyGsiName,
        UPTIME_CHECK_LAMBDA_NAME: props.uptimeCheckLambda.lambda.functionName,
      },
      timeout: cdk.Duration.minutes(5),
    });

    // allow the check lambda to be able to be invoked by the job runner
    props.uptimeCheckLambda.lambda.grantInvoke(this.lambda);
    // allow job runner to be able to read monitors
    props.uptimeCheckMonitorTable.grantReadData(this.lambda);
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
  public readonly jobRunnerLambda: JobRunnerLambda;
  public readonly lambdaCodeIBucket: s3.IBucket;

  constructor(
    scope: cdk.Construct,
    id: string,
    props: {
      uptimeCheckMonitorStatusTable: dynamodb.Table;
      uptimeCheckMonitorTableFrequencyGsiName: string;
      uptimeCheckMonitorTable: dynamodb.Table;
      region: string;
      lambdaCodeBucketName: string;
      uptimeCheckLambdaBucketKey: string;
      jobRunnerLambdaBucketKey: string;
    }
  ) {
    super(scope, id);

    this.lambdaCodeIBucket = s3.Bucket.fromBucketAttributes(
      this,
      "dev_lambda_code_bucket",
      { bucketName: props.lambdaCodeBucketName }
    );

    // this.alertLambda = new AlertLambda(this, "alert_lambda", {
    //   lambdaCodeIBucket: this.lambdaCodeIBucket,
    //   monitorStatusTable: props.monitorStatusTable,
    // });

    this.uptimeCheckLambda = new UptimeCheckLambda(
      this,
      "dev_uptime_check_lambda",
      {
        monitorStatusTable: props.uptimeCheckMonitorStatusTable,
        lambdaCodeIBucket: this.lambdaCodeIBucket,
        key: props.uptimeCheckLambdaBucketKey,
        region: props.region,
        //alertLambda: this.alertLambda,
      }
    );

    this.jobRunnerLambda = new JobRunnerLambda(this, "jobRunnerLambda", {
      uptimeCheckLambda: this.uptimeCheckLambda,
      lambdaCodeIBucket: this.lambdaCodeIBucket,
      key: props.jobRunnerLambdaBucketKey,
      uptimeCheckMonitorTable: props.uptimeCheckMonitorTable,
      uptimeCheckMonitorTableFrequencyGsiName:
        props.uptimeCheckMonitorTableFrequencyGsiName,
      region: props.region,
    });
  }
}
