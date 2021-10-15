import {
  DynamoDBClient,
  paginateQuery,
  QueryCommand,
  QueryCommandInput,
} from "@aws-sdk/client-dynamodb";
import { unmarshall } from "@aws-sdk/util-dynamodb";
import { Alert, UptimeMonitor, UptimeMonitorStatus, User } from "project-types";

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

export async function getUserById(
  ddbClient: DynamoDBClient,
  userTableName: string,
  id: string
): Promise<User | undefined> {
  try {
    const queryCommandInput: QueryCommandInput = {
      TableName: userTableName,
      KeyConditionExpression: "pk = :partitionkeyval AND sk = :sortkeyval",
      ExpressionAttributeValues: {
        ":partitionkeyval": { S: "USER#" + id },
        ":sortkeyval": { S: "USER#" + id },
      },
    };
    const response = await ddbClient.send(new QueryCommand(queryCommandInput));
    if (response.Count && response.Count > 0 && response.Items) {
      const user = unmarshall(response.Items[0]) as User;
      return user;
    }
  } catch (err) {
    return;
  }
}

export async function getAlertForUserByAlertId(
  ddbClient: DynamoDBClient,
  tableName: string,
  userId: string,
  alertId: string
) {
  try {
    const queryCommandInput: QueryCommandInput = {
      TableName: tableName,
      KeyConditionExpression:
        "owner_id = :partitionkeyval AND alert_id = :sortkeyval",
      ExpressionAttributeValues: {
        ":partitionkeyval": { S: userId },
        ":sortkeyval": { S: alertId },
      },
    };
    const response = await ddbClient.send(new QueryCommand(queryCommandInput));
    if (response?.Count === 1 && response.Items) {
      return unmarshall(response.Items[0]) as Alert;
    }
  } catch (err) {
    return null;
  }
}
