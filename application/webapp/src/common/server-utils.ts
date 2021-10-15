import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import Stripe from "stripe";

export const env = {
  UPTIME_MONITOR_TABLE_NAME: process.env.UPTIME_MONITOR_TABLE_NAME as string,
  USER_TABLE_NAME: process.env.USER_TABLE_NAME as string,
  UPTIME_MONITOR_STATUS_TABLE_NAME: process.env
    .UPTIME_MONITOR_STATUS_TABLE_NAME as string,
  ALERT_TABLE_NAME: process.env.ALERT_TABLE_NAME as string,
  ALERT_INVOCATION_TABLE_NAME: process.env
    .ALERT_INVOCATION_TABLE_NAME as string,
  ALERT_INVOCATION_TABLE_LSI_NAME: process.env
    .ALERT_INVOCATION_TABLE_LSI_NAME as string,
  SERVER_HOSTNAME: process.env.SERVER_HOSTNAME as string,
  STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY as string,
  STRIPE_PUBLISHABLE_KEY: process.env.STRIPE_PUBLISHABLE_KEY as string,
  STRIPE_WEBHOOK_SECRET: process.env.STRIPE_WEBHOOK_SECRET as string,
  STRIPE_WEBHOOK_TABLE_NAME: process.env.STRIPE_WEBHOOK_TABLE_NAME as string,
  BASE_URL: process.env.NEXT_PUBLIC_BASE_URL as string,
};

export const ddbClient = new DynamoDBClient({ region: "us-east-1" });

export const stripeClient = new Stripe(env.STRIPE_SECRET_KEY, {
  apiVersion: "2020-08-27",
  typescript: true,
});

export const API_ERROR_REASONS = {
  SUBSCRIPTION_EXPIRED: 1,
  CREATION_LIMIT_REACHED: 2,
  RESOURCE_DOES_NOT_BELONG_TO_REQUESTER: 3,
};
