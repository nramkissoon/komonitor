import {
  DynamoDBClient,
  paginateQuery,
  QueryCommand,
  QueryCommandInput,
} from "@aws-sdk/client-dynamodb";
import { unmarshall } from "@aws-sdk/util-dynamodb";
import { UptimeMonitor, UptimeMonitorStatus } from "project-types";

export async function getUptimeMonitorForUserByMonitorId(
  ddbClient: DynamoDBClient,
  tableName: string,
  userId: string,
  monitorId: string
) {
  try {
    const queryCommandInput: QueryCommandInput = {
      TableName: tableName,
      KeyConditionExpression:
        "owner_id = :partitionkeyval AND monitor_id = :sortkeyval",
      ExpressionAttributeValues: {
        ":partitionkeyval": { S: userId },
        ":sortkeyval": { S: monitorId },
      },
    };
    const response = await ddbClient.send(new QueryCommand(queryCommandInput));
    if (response?.Count === 1 && response.Items) {
      return unmarshall(response.Items[0]) as UptimeMonitor;
    }
  } catch (err) {
    return null;
  }
}

export async function getStatusesForUptimeMonitor(
  ddbClient: DynamoDBClient,
  monitorId: string,
  tableName: string,
  limit: number
) {
  try {
    const queryCommandInput: QueryCommandInput = {
      TableName: tableName,
      KeyConditionExpression: "monitor_id = :partitionkeyval",
      ExpressionAttributeValues: {
        ":partitionkeyval": { S: monitorId },
      },
      ScanIndexForward: false,
      Limit: limit,
    };
    const query = paginateQuery({ client: ddbClient }, queryCommandInput);
    const statuses: UptimeMonitorStatus[] = [];
    let done = false;
    while (!done) {
      const page = await query.next();
      done = page.done === undefined || page.done;
      const queryItems = page.value?.Items ? page.value.Items : [];
      queryItems.forEach((item) =>
        statuses.push(unmarshall(item) as UptimeMonitorStatus)
      );
    }
    return statuses;
  } catch (err) {
    console.error(err);
    return [];
  }
}
