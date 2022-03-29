import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { SendRawEmailCommand, SES } from "@aws-sdk/client-ses";
import { DateTime } from "luxon";
import nodemailer from "nodemailer";
import spacetime from "spacetime";
import {
  HtmlOperators,
  JsonOperators,
  NumericalOperators,
  TimingPhaseProperties,
  UpConditionCheckResult,
  UptimeMonitorStatus,
} from "utils";

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

export const expectationString = ({
  property,
  expectedValue,
  comparison,
  type,
  actualValue,
}: {
  property: string | TimingPhaseProperties;
  expectedValue: string | number;
  comparison: NumericalOperators | JsonOperators | HtmlOperators;
  actualValue: string | number | boolean | null;
  type: "latency" | "code" | "json_body" | "html_body";
}) => {
  let propertyString = "";
  if (type === "latency") {
    switch (property) {
      case "total":
        propertyString = "total response time";
        break;
      case "wait":
        propertyString = "time spent waiting request to fire";
        break;
      case "dns":
        propertyString = "time spent resolving DNS";
        break;
      case "connect":
        propertyString = "socket connection time";
        break;
      case "download":
        propertyString = "time spent downloading response";
        break;
      case "firstByte":
        propertyString = "time to first byte";
        break;
      case "tls":
        propertyString = "time spent negotiating TLS";
        break;
      case "tcp":
        propertyString = "time spent negotiating TCP";
        break;
      default:
        break;
    }
  }

  if (type === "code") propertyString = "response code";
  if (type === "html_body") propertyString = "HTML body";
  if (type === "json_body") propertyString = property;

  let comparisonString = "";
  switch (comparison) {
    case "equal":
      comparisonString = "to be equal to";
      break;
    case "greater":
      comparisonString = "to be greater than";
      break;
    case "less":
      comparisonString = "to be less than";
      break;
    case "greater_or_equal":
      comparisonString = "to be greater than or equal to";
      break;
    case "less_or_equal":
      comparisonString = "to be less than or equal to";
      break;
    case "not_equal":
      comparisonString = "to be not equal to";
      break;
    case "null":
      comparisonString = "to be null.";
      break;
    case "not_null":
      comparisonString = "to be not null.";
      break;
    case "contains":
      comparisonString = "to contain";
      break;
    case "not_contains":
      comparisonString = "to not contain";
      break;
    case "empty":
      comparisonString = "to be empty.";
      break;
    case "not_empty":
      comparisonString = "to be not empty.";
      break;
  }

  let expectedValueString = '""';
  if (typeof expectedValue === "string") {
    expectedValueString = '"' + expectedValue + '"';
  } else if (typeof expectedValue === "number") {
    expectedValueString = expectedValue.toString();
  } else if (typeof expectedValue === "boolean") {
    expectedValueString = (expectedValue ? "true" : "false").toString();
  } else if (expectedValue === null) {
    expectedValueString = "null";
  }

  let actualValueString = '""';
  if (typeof actualValue === "string") {
    actualValueString = '"' + actualValue + '"';
  } else if (typeof actualValue === "number") {
    actualValueString = actualValue.toString();
  } else if (typeof actualValue === "boolean") {
    actualValueString = (actualValue ? "true" : "false").toString();
  } else if (actualValue === null) {
    actualValueString = "null";
  }

  return `Expected ${propertyString} ${comparisonString} ${expectedValueString} but got ${actualValueString}.`;
};

export const getDisplayStringFromFailedCheck = (
  failedCheck: UpConditionCheckResult
) => {
  if (failedCheck.passed) {
    return "";
  }

  const check = failedCheck.check;
  const checkType = check.type;

  switch (checkType) {
    case "code":
      break;
    case "latency":
      break;
    case "html_body":
      break;
    case "json_body":
      break;
  }
};
