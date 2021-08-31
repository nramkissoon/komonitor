import * as cdk from "@aws-cdk/core";
import * as dynamodb from "@aws-cdk/aws-dynamodb";

export class DevStackDdbTables extends cdk.Construct {
  public readonly uptimeMonitorTable: dynamodb.Table;
  public readonly uptimeMonitorStatusTable: dynamodb.Table;
  public readonly userTable: dynamodb.Table;
  public readonly alarmTable: dynamodb.Table;
  public readonly alarmStatusTable: dynamodb.Table;

  constructor(scope: cdk.Construct, id: string, props: {}) {
    super(scope, id);

    this.userTable = new dynamodb.Table(this, "dev_user", {
      partitionKey: { name: "pk", type: dynamodb.AttributeType.STRING },
      sortKey: { name: "sk", type: dynamodb.AttributeType.STRING },
      billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
    });

    this.userTable.addGlobalSecondaryIndex({
      indexName: "GSI1",
      partitionKey: { name: "GSI1PK", type: dynamodb.AttributeType.STRING },
      sortKey: { name: "GSI1SK", type: dynamodb.AttributeType.STRING },
      projectionType: dynamodb.ProjectionType.ALL,
    });

    this.uptimeMonitorTable = new dynamodb.Table(this, "dev_uptime_monitor", {
      partitionKey: { name: "owner_id", type: dynamodb.AttributeType.STRING },
      sortKey: { name: "monitor_id", type: dynamodb.AttributeType.STRING },
      billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
    });

    this.uptimeMonitorTable.addGlobalSecondaryIndex({
      indexName: "frequencyGSI",
      partitionKey: { name: "frequency", type: dynamodb.AttributeType.NUMBER },
      sortKey: { name: "monitor_id", type: dynamodb.AttributeType.STRING },
      projectionType: dynamodb.ProjectionType.ALL,
    });

    this.uptimeMonitorStatusTable = new dynamodb.Table(
      this,
      "dev_uptime_monitor_status",
      {
        partitionKey: {
          name: "monitor_id",
          type: dynamodb.AttributeType.STRING,
        },
        sortKey: { name: "timestamp", type: dynamodb.AttributeType.NUMBER },
        billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
        removalPolicy: cdk.RemovalPolicy.DESTROY,
      }
    );

    this.alarmTable = new dynamodb.Table(this, "alarm", {
      partitionKey: { name: "monitor_id", type: dynamodb.AttributeType.STRING },
      sortKey: { name: "alarm_id", type: dynamodb.AttributeType.STRING },
      billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
    });

    this.alarmStatusTable = new dynamodb.Table(this, "alarm_status", {
      partitionKey: {
        name: "alarm_id",
        type: dynamodb.AttributeType.STRING,
      },
      sortKey: { name: "timestamp", type: dynamodb.AttributeType.NUMBER },
      billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
    });
  }
}
