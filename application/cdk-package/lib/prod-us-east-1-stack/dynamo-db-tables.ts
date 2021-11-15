import * as dynamodb from "@aws-cdk/aws-dynamodb";
import * as cdk from "@aws-cdk/core";

export class ProdDdbTables extends cdk.Construct {
  public readonly uptimeMonitorTable: dynamodb.Table;
  public readonly uptimeMonitorStatusTable: dynamodb.Table;
  public readonly uptimeCheckMonitorTableFrequencyGsiName: string;
  public readonly userTable: dynamodb.Table;
  public readonly alertTable: dynamodb.Table;
  public readonly alertInvocationTable: dynamodb.Table;
  public readonly alertInvocationTableTimestampLsiName: string;
  public readonly stripeWebhooksTable: dynamodb.Table;

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

    this.uptimeCheckMonitorTableFrequencyGsiName = "frequencyGSI";

    this.uptimeMonitorTable.addGlobalSecondaryIndex({
      indexName: this.uptimeCheckMonitorTableFrequencyGsiName,
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

    this.alertTable = new dynamodb.Table(this, "alert_table", {
      partitionKey: { name: "owner_id", type: dynamodb.AttributeType.STRING },
      sortKey: { name: "alert_id", type: dynamodb.AttributeType.STRING },
      billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
      removalPolicy: cdk.RemovalPolicy.RETAIN,
      pointInTimeRecovery: true,
      tableName: "komonitor-prod-alert",
    });

    this.alertInvocationTable = new dynamodb.Table(
      this,
      "alert_invocation_table",
      {
        partitionKey: {
          name: "alert_id",
          type: dynamodb.AttributeType.STRING,
        },
        sortKey: {
          name: "monitor_id_timestamp",
          type: dynamodb.AttributeType.STRING,
        },
        billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
        removalPolicy: cdk.RemovalPolicy.RETAIN,
        pointInTimeRecovery: true,
        tableName: "komonitor-prod-alert-invocation2",
      }
    );

    this.alertInvocationTableTimestampLsiName = "timestampLSI";

    this.alertInvocationTable.addLocalSecondaryIndex({
      indexName: this.alertInvocationTableTimestampLsiName,
      sortKey: { name: "timestamp", type: dynamodb.AttributeType.NUMBER },
      projectionType: dynamodb.ProjectionType.ALL,
    });

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
  }
}