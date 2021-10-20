import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { SendRawEmailCommand, SES } from "@aws-sdk/client-ses";
import nodemailer from "nodemailer";

interface Config {
  region: string;
  uptimeMonitorTableName: string;
  uptimeMonitorStatusTableName: string;
  alertTableName: string;
  alertInvocationTableName: string;
  userTableName: string;
  alertInvocationTableTimeStampLsiName: string;
}

export const config: Config = {
  region: process.env.REGION || "us-east-1",
  uptimeMonitorTableName: process.env.UPTIME_MONITOR_TABLE_NAME as string,
  uptimeMonitorStatusTableName: process.env
    .UPTIME_MONITOR_STATUS_TABLE_NAME as string,
  alertTableName: process.env.ALERT_TABLE_NAME as string,
  alertInvocationTableName: process.env.ALERT_INVOCATION_TABLE_NAME as string,
  userTableName: process.env.USER_TABLE_NAME as string,
  alertInvocationTableTimeStampLsiName: process.env
    .ALERT_INVOCATION_TABLE_TIMESTAMP_LSI_NAME as string,
};

export const ddbClient = new DynamoDBClient({ region: "us-east-1" });
export const ses = new SES({
  apiVersion: "2010-12-01",
  region: "us-east-1",
});

export const emailTransporter = nodemailer.createTransport({
  SES: { ses: ses, aws: { SendRawEmailCommand } },
});
