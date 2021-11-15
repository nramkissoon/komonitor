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

export const regionToLocationStringMap = {
  "us-east-1": "Virginia, USA",
  "us-east-2": "Ohio, USA",
  "us-west-1": "Northern California, USA",
  "us-west-2": "Oregon, USA",
  "ap-south-1": "Mumbai, India",
  "ap-northeast-3": "Osaka, Japan",
  "ap-northeast-2": "Seoul, South Korea",
  "ap-southeast-1": "Singapore",
  "ap-southeast-2": "Sydney, Australia",
  "ap-northeast-1": "Tokyo, Japan",
  "ca-central-1": "Central Canada",
  "eu-central-1": "Frankfurt, Germany",
  "eu-west-1": "Ireland",
  "eu-west-2": "London, UK",
  "eu-west-3": "Paris, France",
  "eu-north-1": "Stockholm, Sweden",
  "sa-east-1": "São Paulo, Brazil",
};
