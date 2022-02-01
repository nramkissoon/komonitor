import {
  DynamoDBClient,
  paginateQuery,
  QueryCommandInput,
} from "@aws-sdk/client-dynamodb";
import { unmarshall } from "@aws-sdk/util-dynamodb";
import { UptimeMonitorStatus } from "project-types";
import { createMonitorIdToStatusArrayMap } from "./utils";

async function getStatusesForMonitor(
  ddbClient: DynamoDBClient,
  monitorId: string,
  tableName: string,
  since: number
) {
  try {
    const queryCommandInput: QueryCommandInput = {
      TableName: tableName,
      ExpressionAttributeNames: { "#t": "timestamp" },
      KeyConditionExpression:
        "monitor_id = :partitionkeyval AND #t >= :sortkeyval",
      ExpressionAttributeValues: {
        ":partitionkeyval": { S: monitorId },
        ":sortkeyval": { N: since.toString() },
      },
      ScanIndexForward: false,
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

export async function getStatusesForMultipleMonitors(
  ddbClient: DynamoDBClient,
  monitorIds: string[],
  tableName: string,
  since: number
) {
  const allStatuses: UptimeMonitorStatus[] = [];
  const promises = [];
  for (let id of monitorIds) {
    promises.push(getStatusesForMonitor(ddbClient, id, tableName, since));
  }
  const results = await Promise.allSettled(promises);
  for (let result of results) {
    if (result.status === "fulfilled") {
      allStatuses.push(...result.value);
    }
  }
  return createMonitorIdToStatusArrayMap(monitorIds, allStatuses);
}
