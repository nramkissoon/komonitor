import * as dynamodb from "@aws-cdk/aws-dynamodb";
import * as cdk from "@aws-cdk/core";

export class ProdDdbTables extends cdk.Construct {
  public readonly uptimeMonitorTable: dynamodb.Table;
  public readonly uptimeMonitorStatusTable: dynamodb.Table;
  public readonly uptimeMonitorTableFrequencyGsiName: string;
  public readonly uptimeCheckMonitorTableProjectIdGsiName: string;
  public readonly userTable: dynamodb.Table;
  public readonly alertInvocationTable: dynamodb.Table;
  public readonly stripeWebhooksTable: dynamodb.Table;
  public readonly lighthouseJobTable: dynamodb.Table;
  public readonly lighthouseJobTableFrequencyGsiName: string;
  public readonly projectsTable: dynamodb.Table;

  constructor(scope: cdk.Construct, id: string, props: {}) {
    super(scope, id);

    this.userTable = new dynamodb.Table(this, "user_table", {
      partitionKey: { name: "pk", type: dynamodb.AttributeType.STRING },
      sortKey: { name: "sk", type: dynamodb.AttributeType.STRING },
      billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
      removalPolicy: cdk.RemovalPolicy.RETAIN,
      tableName: "komonitor-prod-user",
      pointInTimeRecovery: true,
    });

    this.userTable.addGlobalSecondaryIndex({
      indexName: "GSI1",
      partitionKey: { name: "GSI1PK", type: dynamodb.AttributeType.STRING },
      sortKey: { name: "GSI1SK", type: dynamodb.AttributeType.STRING },
      projectionType: dynamodb.ProjectionType.ALL,
    });

    this.uptimeMonitorTable = new dynamodb.Table(this, "uptime_monitor_table", {
      partitionKey: { name: "owner_id", type: dynamodb.AttributeType.STRING },
      sortKey: { name: "monitor_id", type: dynamodb.AttributeType.STRING },
      billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
      removalPolicy: cdk.RemovalPolicy.RETAIN,
      pointInTimeRecovery: true,
      tableName: "komonitor-prod-uptime-monitor",
    });

    this.uptimeMonitorTableFrequencyGsiName = "frequencyGSI";

    this.uptimeMonitorTable.addGlobalSecondaryIndex({
      indexName: this.uptimeMonitorTableFrequencyGsiName,
      partitionKey: { name: "frequency", type: dynamodb.AttributeType.NUMBER },
      sortKey: { name: "region", type: dynamodb.AttributeType.STRING },
      projectionType: dynamodb.ProjectionType.ALL,
    });

    // CloudFormation cannot update a stack when a custom-named resource requires replacing.
    this.uptimeCheckMonitorTableProjectIdGsiName = "projectIdGsi";

    this.uptimeMonitorTable.addGlobalSecondaryIndex({
      indexName: this.uptimeCheckMonitorTableProjectIdGsiName,
      partitionKey: { name: "owner_id", type: dynamodb.AttributeType.STRING },
      sortKey: { name: "project_id", type: dynamodb.AttributeType.STRING },
      projectionType: dynamodb.ProjectionType.ALL,
    });

    this.lighthouseJobTable = new dynamodb.Table(this, "dev_lighthouse_job", {
      partitionKey: { name: "owner_id", type: dynamodb.AttributeType.STRING },
      sortKey: { name: "job_id", type: dynamodb.AttributeType.STRING },
      billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
      removalPolicy: cdk.RemovalPolicy.RETAIN,
      pointInTimeRecovery: true,
      tableName: "komonitor-prod-lighthouse-job",
    });

    this.lighthouseJobTableFrequencyGsiName = "frequencyGSI";

    this.lighthouseJobTable.addGlobalSecondaryIndex({
      indexName: this.lighthouseJobTableFrequencyGsiName,
      partitionKey: { name: "frequency", type: dynamodb.AttributeType.NUMBER },
      sortKey: { name: "region", type: dynamodb.AttributeType.STRING },
      projectionType: dynamodb.ProjectionType.ALL,
    });

    this.uptimeMonitorStatusTable = new dynamodb.Table(
      this,
      "uptime_monitor_status_table",
      {
        partitionKey: {
          name: "monitor_id",
          type: dynamodb.AttributeType.STRING,
        },
        sortKey: { name: "timestamp", type: dynamodb.AttributeType.NUMBER },
        billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
        removalPolicy: cdk.RemovalPolicy.RETAIN,
        pointInTimeRecovery: true,
        tableName: "komonitor-prod-uptime-monitor-status",
      }
    );

    this.alertInvocationTable = new dynamodb.Table(
      this,
      "alert_invocation_table",
      {
        partitionKey: {
          name: "monitor_id",
          type: dynamodb.AttributeType.STRING,
        },
        sortKey: {
          name: "timestamp",
          type: dynamodb.AttributeType.NUMBER,
        },
        billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
        removalPolicy: cdk.RemovalPolicy.RETAIN,
        pointInTimeRecovery: true,
        tableName: "komonitor-prod-alert-invocation-3",
      }
    );

    this.stripeWebhooksTable = new dynamodb.Table(
      this,
      "stripe_webhooks_table",
      {
        partitionKey: {
          name: "id",
          type: dynamodb.AttributeType.STRING,
        },
        sortKey: { name: "created", type: dynamodb.AttributeType.NUMBER },
        billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
        removalPolicy: cdk.RemovalPolicy.RETAIN,
        pointInTimeRecovery: true,
        tableName: "komonitor-prod-stripe-webhook",
      }
    );

    this.projectsTable = new dynamodb.Table(this, "projects", {
      partitionKey: {
        name: "owner_id",
        type: dynamodb.AttributeType.STRING,
      },
      sortKey: { name: "project_id", type: dynamodb.AttributeType.STRING },
      billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
      removalPolicy: cdk.RemovalPolicy.RETAIN,
      tableName: "komonitor-prod-projects",
    });
  }
}
