import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { UptimeMonitor } from "types";

export function getMonitorsForUser(ddbClient: DynamoDBClient, userId: string) {}

export function deleteMonitor(ddbClient: DynamoDBClient, monitorId: string) {}

export function updateMonitor(
  ddbClient: DynamoDBClient,
  monitor: UptimeMonitor
) {}
