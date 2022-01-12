import * as dynamodb from "@aws-cdk/aws-dynamodb";
import * as iam from "@aws-cdk/aws-iam";
import * as lambda from "@aws-cdk/aws-lambda";
import * as s3 from "@aws-cdk/aws-s3";
import * as cdk from "@aws-cdk/core";
import { prodLambdaName } from "../common/names";

class UptimeMonitorLambda extends cdk.Construct {
  public readonly lambda: lambda.Function;

  constructor(
    scope: cdk.Construct,
    id: string,
    props: {
      monitorStatusTable: dynamodb.Table;
      alertLambda: AlertLambda;
      region: string;
      alertInvocationTable: dynamodb.Table;
    }
  ) {
    super(scope, id);

    const { monitorStatusTable, alertLambda, region, alertInvocationTable } =
      props;

    this.lambda = new lambda.Function(this, region + "_prod_uptime_monitor", {
      runtime: lambda.Runtime.NODEJS_14_X,
      handler: "index.handler",
      code: lambda.Code.fromInline("export handler = () => {}"), // WE GET THE CODE FROM A LATER STEP IN THE STAGE FROM COPYING
      functionName: prodLambdaName(region, "uptime"),
      environment: {
        REGION: region,
        MONITOR_STATUS_TABLE_NAME: monitorStatusTable.tableName,
        ALERT_LAMBDA_NAME: alertLambda.lambda.functionName,
        ALERT_INVOCATION_TABLE_NAME: alertInvocationTable.tableName,
      },
      timeout: cdk.Duration.seconds(60),
      memorySize: 140,
    });

    const monitorStatusDbWritePolicyStatement = new iam.PolicyStatement({
      resources: [monitorStatusTable.tableArn],
      effect: iam.Effect.ALLOW,
      actions: [
        "dynamodb:BatchWriteItem",
        "dynamodb:PutItem",
        "dynamodb:UpdateItem",
      ],
    });
    const monitorStatusDbWritePolicy = new iam.Policy(
      this,
      region + "_prod_monitor_status_db_write_policy",
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
      uptimeMonitorLambda: UptimeMonitorLambda;
      region: string;
      uptimeMonitorTable: dynamodb.Table;
      uptimeMonitorTableFrequencyGsiName: string;
      lighthouseJobTable: dynamodb.Table;
      lighthouseJobTableFrequencyGsiName: string;
    }
  ) {
    super(scope, id);

    const {
      uptimeMonitorLambda,
      region,
      uptimeMonitorTable,
      uptimeMonitorTableFrequencyGsiName,
      lighthouseJobTable,
      lighthouseJobTableFrequencyGsiName,
    } = props;

    this.lambda = new lambda.Function(this, region + "_prod_job_runner", {
      runtime: lambda.Runtime.NODEJS_14_X,
      handler: "index.handler",
      code: lambda.Code.fromInline("export handler = () => {}"),
      functionName: prodLambdaName(region, "jobrunner"),
      environment: {
        REGION: region,
        UPTIME_CHECK_MONITOR_TABLE_NAME: uptimeMonitorTable.tableName,
        UPTIME_CHECK_MONITOR_TABLE_FREQUENCY_GSI_NAME:
          uptimeMonitorTableFrequencyGsiName,
        UPTIME_CHECK_LAMBDA_NAME: uptimeMonitorLambda.lambda.functionName,
        LIGHTHOUSE_JOB_TABLE_NAME: lighthouseJobTable.tableName,
        LIGHTHOUSE_JOB_TABLE_FREQUENCY_GSI_NAME:
          lighthouseJobTableFrequencyGsiName,
      },
      timeout: cdk.Duration.minutes(1),
    });

    // allow the check lambda to be able to be invoked by the job runner
    uptimeMonitorLambda.lambda.grantInvoke(this.lambda);
    // allow job runner to be able to read monitors
    uptimeMonitorTable.grantReadData(this.lambda);

    lighthouseJobTable.grantReadData(this.lambda);
  }
}

class AlertLambda extends cdk.Construct {
  public readonly lambda: lambda.Function;
  constructor(
    scope: cdk.Construct,
    id: string,
    props: {
      uptimeMonitorTable: dynamodb.Table;
      uptimeMonitorStatusTable: dynamodb.Table;

      alertInvocationTable: dynamodb.Table;
      userTable: dynamodb.Table;

      region: string;
    }
  ) {
    super(scope, id);

    const {
      uptimeMonitorStatusTable,
      uptimeMonitorTable,
      alertInvocationTable,
      region,
      userTable,
    } = props;

    this.lambda = new lambda.Function(this, region + "_prod_alert", {
      runtime: lambda.Runtime.NODEJS_14_X,
      handler: "index.handler",
      code: lambda.Code.fromInline("export handler = () => {}"),
      functionName: prodLambdaName(region, "alert"),
      environment: {
        REGION: region,
        UPTIME_MONITOR_TABLE_NAME: uptimeMonitorTable.tableName,
        UPTIME_MONITOR_STATUS_TABLE_NAME: uptimeMonitorStatusTable.tableName,
        ALERT_INVOCATION_TABLE_NAME: alertInvocationTable.tableName,
        USER_TABLE_NAME: userTable.tableName,
      },
      timeout: cdk.Duration.minutes(2),
    });

    uptimeMonitorTable.grantReadData(this.lambda);
    uptimeMonitorStatusTable.grantReadData(this.lambda);
    alertInvocationTable.grantReadWriteData(this.lambda);
    userTable.grantReadData(this.lambda);

    const sesSendPolicyStatement = new iam.PolicyStatement({
      resources: ["*"],
      effect: iam.Effect.ALLOW,
      actions: ["ses:SendEmail", "ses:SendRawEmail"],
    });

    const sesSendPolicy = new iam.Policy(
      this,
      region + "_prod_ses_send_policy",
      {
        statements: [sesSendPolicyStatement],
      }
    );

    this.lambda.role?.attachInlinePolicy(sesSendPolicy);
  }
}

export class Lambdas extends cdk.Construct {
  public readonly uptimeLambda: UptimeMonitorLambda;
  public readonly alertLambda: AlertLambda;
  public readonly jobRunnerLambda: JobRunnerLambda;
  public readonly lambdaCodeIBucket: s3.IBucket;

  constructor(
    scope: cdk.Construct,
    id: string,
    props: {
      uptimeMonitorStatusTable: dynamodb.Table;
      uptimeMonitorTableFrequencyGsiName: string;
      uptimeMonitorTable: dynamodb.Table;

      userTable: dynamodb.Table;
      alertInvocationTable: dynamodb.Table;
      region: string;
      lambdaCodeBucketName: string;

      lighthouseJobTable: dynamodb.Table;
      lighthouseJobTableFrequencyGsiName: string;
    }
  ) {
    super(scope, id);

    const {
      lambdaCodeBucketName,
      uptimeMonitorStatusTable,
      uptimeMonitorTable,
      uptimeMonitorTableFrequencyGsiName,
      alertInvocationTable,

      region,
      userTable,
      lighthouseJobTable,
      lighthouseJobTableFrequencyGsiName,
    } = props;

    this.lambdaCodeIBucket = s3.Bucket.fromBucketAttributes(
      this,
      "prodLambdaCodeBucket",
      { bucketName: lambdaCodeBucketName }
    );

    this.alertLambda = new AlertLambda(this, "prodAlertLambda", {
      alertInvocationTable: alertInvocationTable,

      uptimeMonitorStatusTable: uptimeMonitorStatusTable,
      uptimeMonitorTable: uptimeMonitorTable,
      userTable: userTable,
      region: region,
    });

    this.uptimeLambda = new UptimeMonitorLambda(
      this,
      "prodUptimeMonitorLambda",
      {
        monitorStatusTable: uptimeMonitorStatusTable,
        region: region,
        alertLambda: this.alertLambda,
        alertInvocationTable: alertInvocationTable,
      }
    );

    this.jobRunnerLambda = new JobRunnerLambda(this, "prodJobRunnerLambda", {
      uptimeMonitorLambda: this.uptimeLambda,
      uptimeMonitorTable: uptimeMonitorTable,
      uptimeMonitorTableFrequencyGsiName: uptimeMonitorTableFrequencyGsiName,
      region: region,
      lighthouseJobTable: lighthouseJobTable,
      lighthouseJobTableFrequencyGsiName: lighthouseJobTableFrequencyGsiName,
    });
  }
}
