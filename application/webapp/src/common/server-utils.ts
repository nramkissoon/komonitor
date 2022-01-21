import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import Stripe from "stripe";

export const env = {
  UPTIME_MONITOR_TABLE_NAME: process.env.UPTIME_MONITOR_TABLE_NAME as string,
  USER_TABLE_NAME: process.env.USER_TABLE_NAME as string,
  UPTIME_MONITOR_STATUS_TABLE_NAME: process.env
    .UPTIME_MONITOR_STATUS_TABLE_NAME as string,
  ALERT_INVOCATION_TABLE_NAME: process.env
    .ALERT_INVOCATION_TABLE_NAME as string,
  SERVER_HOSTNAME: process.env.SERVER_HOSTNAME as string,
  STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY as string,
  STRIPE_PUBLISHABLE_KEY: process.env.STRIPE_PUBLISHABLE_KEY as string,
  STRIPE_WEBHOOK_SECRET: process.env.STRIPE_WEBHOOK_SECRET as string,
  STRIPE_WEBHOOK_TABLE_NAME: process.env.STRIPE_WEBHOOK_TABLE_NAME as string,
  BASE_URL: process.env.NEXT_PUBLIC_BASE_URL as string,
  AWS_ACCESS_KEY_ID_KOMONITOR: process.env
    .AWS_ACCESS_KEY_ID_KOMONITOR as string,
  AWS_SECRET_ACCESS_KEY_KOMONITOR: process.env
    .AWS_SECRET_ACCESS_KEY_KOMONITOR as string,
  SLACK_STATE_SECRET: process.env.SLACK_STATE_SECRET as string,
  SLACK_CLIENT_ID: process.env.SLACK_CLIENT_ID as string,
  SLACK_CLIENT_SECRET: process.env.SLACK_CLIENT_SECRET as string,
  SLACK_REDIRECT: process.env.NEXT_PUBLIC_SLACK_REDIRECT as string,
  UPTIME_MONITOR_TABLE_PID_LSI_NAME: process.env
    .UPTIME_MONITOR_TABLE_PID_LSI_NAME as string,
  PROJECTS_TABLE_NAME: process.env.PROJECTS_TABLE_NAME as string,
};

export const ddbClient = new DynamoDBClient({
  region: "us-east-1",
  credentials: {
    accessKeyId: env.AWS_ACCESS_KEY_ID_KOMONITOR,
    secretAccessKey: env.AWS_SECRET_ACCESS_KEY_KOMONITOR,
  },
});

export const stripeClient = new Stripe(env.STRIPE_SECRET_KEY, {
  apiVersion: "2020-08-27",
  typescript: true,
});

export const API_ERROR_REASONS = {
  SUBSCRIPTION_EXPIRED: 1,
  CREATION_LIMIT_REACHED: 2,
  RESOURCE_DOES_NOT_BELONG_TO_REQUESTER: 3,
};

export const REGIONS = Object.keys({
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
});
