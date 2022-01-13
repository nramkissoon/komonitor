import * as dynamodb from "@aws-cdk/aws-dynamodb";
import * as iam from "@aws-cdk/aws-iam";
import * as lambda from "@aws-cdk/aws-lambda";
import * as s3 from "@aws-cdk/aws-s3";
import * as cdk from "@aws-cdk/core";
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
      alertLambda: AlertLambda;
      region: string;
      alertInvocationTable: dynamodb.Table;
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
        ALERT_LAMBDA_NAME: props.alertLambda.lambda.functionName,
        ALERT_INVOCATION_TABLE_NAME: props.alertInvocationTable.tableName,
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

    props.alertLambda.lambda.grantInvoke(this.lambda);
    props.alertInvocationTable.grantReadWriteData(this.lambda);
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
      lighthouseJobTable: dynamodb.Table;
      lighthouseJobTableFrequencyGsiName: string;
    }
  ) {
    super(scope, id);

    this.lambda = new lambda.Function(this, "job-runner", {
      runtime: lambda.Runtime.NODEJS_14_X,
      handler: "index.handler",
      code: lambda.Code.fromBucket(props.lambdaCodeIBucket, props.key),
      functionName: DEV_STACK.JOB_RUNNER_LAMBDA,
      environment: {
        REGION: props.region,
        UPTIME_CHECK_MONITOR_TABLE_NAME:
          props.uptimeCheckMonitorTable.tableName,
        UPTIME_CHECK_MONITOR_TABLE_FREQUENCY_GSI_NAME:
          props.uptimeCheckMonitorTableFrequencyGsiName,
        UPTIME_CHECK_LAMBDA_NAME: props.uptimeCheckLambda.lambda.functionName,
        LIGHTHOUSE_JOB_TABLE_NAME: props.lighthouseJobTable.tableName,
        LIGHTHOUSE_JOB_TABLE_FREQUENCY_GSI_NAME:
          props.lighthouseJobTableFrequencyGsiName,
      },
      timeout: cdk.Duration.minutes(1),
    });

    // allow the check lambda to be able to be invoked by the job runner
    props.uptimeCheckLambda.lambda.grantInvoke(this.lambda);
    // allow job runner to be able to read monitors
    props.uptimeCheckMonitorTable.grantReadData(this.lambda);

    props.lighthouseJobTable.grantReadData(this.lambda);
  }
}

class AlertLambda extends cdk.Construct {
  public readonly lambda: lambda.Function;
  constructor(
    scope: cdk.Construct,
    id: string,
    props: {
      key: string;
      lambdaCodeIBucket: s3.IBucket;
      uptimeMonitorTable: dynamodb.Table;
      uptimeMonitorStatusTable: dynamodb.Table;
      alertInvocationTable: dynamodb.Table;
      userTable: dynamodb.Table;
    }
  ) {
    super(scope, id);

    this.lambda = new lambda.Function(this, "alert", {
      runtime: lambda.Runtime.NODEJS_14_X,
      handler: "index.handler",
      code: lambda.Code.fromBucket(props.lambdaCodeIBucket, props.key),
      functionName: DEV_STACK.ALERT_LAMBDA,
      environment: {
        REGION: "us-east-1",
        UPTIME_MONITOR_TABLE_NAME: props.uptimeMonitorTable.tableName,
        UPTIME_MONITOR_STATUS_TABLE_NAME:
          props.uptimeMonitorStatusTable.tableName,
        ALERT_INVOCATION_TABLE_NAME: props.alertInvocationTable.tableName,
        USER_TABLE_NAME: props.userTable.tableName,
      },
      timeout: cdk.Duration.minutes(2),
    });

    props.uptimeMonitorTable.grantReadData(this.lambda);
    props.uptimeMonitorStatusTable.grantReadData(this.lambda);
    props.alertInvocationTable.grantReadWriteData(this.lambda);
    props.userTable.grantReadData(this.lambda);

    const sesSendPolicyStatement = new iam.PolicyStatement({
      resources: ["*"],
      effect: iam.Effect.ALLOW,
      actions: ["ses:SendEmail", "ses:SendRawEmail"],
    });

    const sesSendPolicy = new iam.Policy(this, "ses_send_policy", {
      statements: [sesSendPolicyStatement],
    });

    this.lambda.role?.attachInlinePolicy(sesSendPolicy);
  }
}

class WeeklyReportLambda extends cdk.Construct {
  public readonly lambda: lambda.Function;
  constructor(
    scope: cdk.Construct,
    id: string,
    props: {
      key: string;
      lambdaCodeIBucket: s3.IBucket;
      uptimeMonitorTable: dynamodb.Table;
      uptimeMonitorStatusTable: dynamodb.Table;
      alertInvocationTable: dynamodb.Table;
      userTable: dynamodb.Table;
    }
  ) {
    super(scope, id);
    this.lambda = new lambda.Function(this, "weeklyReport", {
      runtime: lambda.Runtime.NODEJS_14_X,
      handler: "index.handler",
      code: lambda.Code.fromBucket(props.lambdaCodeIBucket, props.key),
      functionName: DEV_STACK.WEEKLY_REPORT_LAMBDA,
      environment: {
        REGION: "us-east-1",
        UPTIME_MONITOR_TABLE_NAME: props.uptimeMonitorTable.tableName,
        UPTIME_MONITOR_STATUS_TABLE_NAME:
          props.uptimeMonitorStatusTable.tableName,
        ALERT_INVOCATION_TABLE_NAME: props.alertInvocationTable.tableName,
        USER_TABLE_NAME: props.userTable.tableName,
      },
      timeout: cdk.Duration.minutes(10),
    });
    props.uptimeMonitorTable.grantReadData(this.lambda);
    props.uptimeMonitorStatusTable.grantReadData(this.lambda);
    props.alertInvocationTable.grantReadData(this.lambda);
    props.userTable.grantReadData(this.lambda);

    const sesSendPolicyStatement = new iam.PolicyStatement({
      resources: ["*"],
      effect: iam.Effect.ALLOW,
      actions: ["ses:SendEmail", "ses:SendRawEmail"],
    });

    const sesSendPolicy = new iam.Policy(this, "ses_send_policy", {
      statements: [sesSendPolicyStatement],
    });

    this.lambda.role?.attachInlinePolicy(sesSendPolicy);
  }
}

export class DevStackLambdas extends cdk.Construct {
  public readonly uptimeCheckLambda: UptimeCheckLambda;
  public readonly alertLambda: AlertLambda;
  public readonly jobRunnerLambda: JobRunnerLambda;
  public readonly lambdaCodeIBucket: s3.IBucket;
  public readonly weeklyReportLambda: WeeklyReportLambda;

  constructor(
    scope: cdk.Construct,
    id: string,
    props: {
      uptimeCheckMonitorStatusTable: dynamodb.Table;
      uptimeCheckMonitorTableFrequencyGsiName: string;
      uptimeCheckMonitorTable: dynamodb.Table;
      userTable: dynamodb.Table;
      alertInvocationTable: dynamodb.Table;
      region: string;
      lambdaCodeBucketName: string;
      uptimeCheckLambdaBucketKey: string;
      jobRunnerLambdaBucketKey: string;
      alertLambdaBucketKey: string;
      weeklyReportLambdaBucketKey: string;
      lighthouseJobTable: dynamodb.Table;
      lighthouseJobTableFrequencyGsiName: string;
    }
  ) {
    super(scope, id);

    this.lambdaCodeIBucket = s3.Bucket.fromBucketAttributes(
      this,
      "dev_lambda_code_bucket",
      { bucketName: props.lambdaCodeBucketName }
    );

    this.alertLambda = new AlertLambda(this, "alert_lambda", {
      lambdaCodeIBucket: this.lambdaCodeIBucket,
      key: props.alertLambdaBucketKey,
      alertInvocationTable: props.alertInvocationTable,
      uptimeMonitorStatusTable: props.uptimeCheckMonitorStatusTable,
      uptimeMonitorTable: props.uptimeCheckMonitorTable,
      userTable: props.userTable,
    });

    this.uptimeCheckLambda = new UptimeCheckLambda(
      this,
      "dev_uptime_check_lambda",
      {
        monitorStatusTable: props.uptimeCheckMonitorStatusTable,
        lambdaCodeIBucket: this.lambdaCodeIBucket,
        key: props.uptimeCheckLambdaBucketKey,
        region: props.region,
        alertLambda: this.alertLambda,
        alertInvocationTable: props.alertInvocationTable,
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
      lighthouseJobTable: props.lighthouseJobTable,
      lighthouseJobTableFrequencyGsiName:
        props.lighthouseJobTableFrequencyGsiName,
    });

    this.weeklyReportLambda = new WeeklyReportLambda(
      this,
      "weeklyReportLambda",
      {
        lambdaCodeIBucket: this.lambdaCodeIBucket,
        key: props.weeklyReportLambdaBucketKey,
        alertInvocationTable: props.alertInvocationTable,
        uptimeMonitorStatusTable: props.uptimeCheckMonitorStatusTable,
        uptimeMonitorTable: props.uptimeCheckMonitorTable,
        userTable: props.userTable,
      }
    );
  }
}
