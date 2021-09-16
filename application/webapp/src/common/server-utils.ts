import { DynamoDBClient } from "@aws-sdk/client-dynamodb";

export const env = {
  UPTIME_MONITOR_TABLE_NAME: process.env.UPTIME_MONITOR_TABLE_NAME as string,
  USER_TABLE_NAME: process.env.USER_TABLE_NAME as string,
};

export const ddbClient = new DynamoDBClient({ region: "us-east-1" });