import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { SendRawEmailCommand, SES } from "@aws-sdk/client-ses";
import { DateTime } from "luxon";
import nodemailer from "nodemailer";
import { UptimeMonitorStatus } from "project-types";
import spacetime from "spacetime";

interface Config {
  region: string;
  uptimeMonitorTableName: string;
  uptimeMonitorStatusTableName: string;
  alertInvocationTableName: string;
  userTableName: string;
}

export const config: Config = {
  region: process.env.REGION || "us-east-1",
  uptimeMonitorTableName: process.env.UPTIME_MONITOR_TABLE_NAME as string,
  uptimeMonitorStatusTableName: process.env
    .UPTIME_MONITOR_STATUS_TABLE_NAME as string,
  alertInvocationTableName: process.env.ALERT_INVOCATION_TABLE_NAME as string,
  userTableName: process.env.USER_TABLE_NAME as string,
};

export const ddbClient = new DynamoDBClient({ region: "us-east-1" });
export const ses = new SES({
  apiVersion: "2010-12-01",
  region: "us-east-1",
});

export const emailTransporter = nodemailer.createTransport({
  SES: { ses: ses, aws: { SendRawEmailCommand } },
});

export const regionToLocationStringMap: { [key: string]: string } = {
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

export function getTimeString(tz: string, timestamp: number) {
  const now = spacetime.now(tz);
  const offset = now.timezone().current.offset;

  let offsetString = "";
  if (offset > 0) {
    offsetString = "+" + offset;
  } else if (offset < 0) {
    offsetString = offset.toString();
  }
  return DateTime.fromMillis(timestamp)
    .setZone("UTC" + offsetString)
    .toLocaleString(DateTime.DATETIME_MED_WITH_SECONDS);
}

export function convertUptimeMonitorStatusesToStatusesWithReadableTimeStampAndStatusCode(
  tz: string,
  statuses: UptimeMonitorStatus[]
) {
  const newStatuses = statuses.map((status) => ({
    ...status,
    timestampAsUserTz: getTimeString(tz, status.timestamp),
    response_status_code: status.response.statusCode,
  }));
  return newStatuses;
}
