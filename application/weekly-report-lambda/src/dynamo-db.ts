import {
  DynamoDBClient,
  paginateQuery,
  paginateScan,
  QueryCommandInput,
  ScanCommandInput,
} from "@aws-sdk/client-dynamodb";
import { unmarshall } from "@aws-sdk/util-dynamodb";
import {
  AlertInvocation,
  UptimeMonitor,
  UptimeMonitorStatus,
  User,
} from "utils";
import { oneWeekAndOneDayAgo, yesterday } from "./config";

export async function getEmailOptedInUsers(
  ddbClient: DynamoDBClient,
  userTableName: string
): Promise<User[] | undefined> {
  try {
    const scanCommandInput: ScanCommandInput = {
      TableName: userTableName,
      FilterExpression: "begins_with(sk, :p) and emailOptIn = :optIn",
      ExpressionAttributeValues: {
        ":p": { S: "USER#" },
        ":optIn": { BOOL: true },
      },
    };
    const scan = paginateScan({ client: ddbClient }, scanCommandInput);
    const users: User[] = [];
    let done = false;
    while (!done) {
      const page = await scan.next();
      done = page.done === undefined || page.done;
      const queryItems = page.value?.Items ? page.value.Items : [];
      queryItems.forEach((item) => users.push(unmarshall(item) as User));
    }
    return users.filter(
      (user) => user.email !== undefined && user.email !== null
    );
  } catch (err) {
    throw err as Error;
  }
}

export async function getMonitorsForUser(
  ddbClient: DynamoDBClient,
  tableName: string,
  userId: string
) {
  try {
    const queryCommandInput: QueryCommandInput = {
      TableName: tableName,
      KeyConditionExpression: "owner_id = :partitionkeyval",
      ExpressionAttributeValues: {
        ":partitionkeyval": { S: userId },
      },
    };
    const query = paginateQuery({ client: ddbClient }, queryCommandInput);
    const monitors: UptimeMonitor[] = [];
    let done = false;
    while (!done) {
      const page = await query.next();
      done = page.done === undefined || page.done;
      const queryItems = page.value?.Items ? page.value.Items : [];
      queryItems.forEach((item) =>
        monitors.push(unmarshall(item) as UptimeMonitor)
      );
    }
    return monitors;
  } catch (err) {
    throw err as Error;
  }
}

async function getStatusesForMonitor1Week(
  ddbClient: DynamoDBClient,
  monitorId: string,
  tableName: string
) {
  try {
    let from = oneWeekAndOneDayAgo();
    let to = yesterday();
    const queryCommandInput: QueryCommandInput = {
      TableName: tableName,
      ExpressionAttributeNames: { "#t": "timestamp" },
      KeyConditionExpression:
        "monitor_id = :partitionkeyval AND #t BETWEEN :from AND :to",
      ExpressionAttributeValues: {
        ":partitionkeyval": { S: monitorId },
        ":from": { N: from.toString() },
        ":to": { N: to.toString() },
      },
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
    throw err as Error;
  }
}

export function createMonitorIdToStatusArrayMap(
  ids: string[],
  statuses: UptimeMonitorStatus[]
) {
  const map: { [key: string]: UptimeMonitorStatus[] } = {};
  for (let id of ids) {
    if (!map[id]) {
      map[id] = [];
    }
  }
  for (let status of statuses) {
    const id = status.monitor_id;
    map[id].push(status);
  }
  return map;
}

export async function getStatusesForMultipleMonitors1Week(
  ddbClient: DynamoDBClient,
  monitorIds: string[],
  tableName: string
) {
  try {
    const allStatuses: UptimeMonitorStatus[] = [];
    const promises = [];
    for (let id of monitorIds) {
      promises.push(getStatusesForMonitor1Week(ddbClient, id, tableName));
    }
    const results = await Promise.allSettled(promises);
    for (let result of results) {
      if (result.status === "fulfilled") {
        allStatuses.push(...result.value);
      }
    }
    return createMonitorIdToStatusArrayMap(monitorIds, allStatuses);
  } catch (err) {
    throw err as Error;
  }
}

export async function getTotalAlertsForMonitor1Week(
  ddbClient: DynamoDBClient,
  monitorId: string,
  tableName: string
) {
  try {
    let from = oneWeekAndOneDayAgo();
    let to = yesterday();
    const queryCommandInput: QueryCommandInput = {
      TableName: tableName,
      ExpressionAttributeNames: { "#t": "timestamp" },
      KeyConditionExpression:
        "monitor_id = :partitionkeyval AND #t BETWEEN :from AND :to",
      ExpressionAttributeValues: {
        ":partitionkeyval": { S: monitorId },
        ":from": { N: from.toString() },
        ":to": { N: to.toString() },
      },
    };
    const query = paginateQuery({ client: ddbClient }, queryCommandInput);
    const alerts: AlertInvocation[] = [];
    let done = false;
    while (!done) {
      const page = await query.next();
      done = page.done === undefined || page.done;
      const queryItems = page.value?.Items ? page.value.Items : [];
      queryItems.forEach((item) =>
        alerts.push(unmarshall(item) as AlertInvocation)
      );
    }
    return { id: monitorId, total: alerts.length };
  } catch (err) {
    throw err as Error;
  }
}

export async function getTotalAlertsForMultipleMonitors1Week(
  ddbClient: DynamoDBClient,
  monitorIds: string[],
  tableName: string
) {
  try {
    const promises = [];
    const map: { [key: string]: number } = {};
    for (let id of monitorIds) {
      if (!map[id]) {
        map[id] = 0;
      }
    }
    for (let id of monitorIds) {
      promises.push(getTotalAlertsForMonitor1Week(ddbClient, id, tableName));
    }
    const results = await Promise.allSettled(promises);
    for (let result of results) {
      if (result.status === "fulfilled") {
        map[result.value.id] = result.value.total;
      }
    }
    return map;
  } catch (err) {
    throw err as Error;
  }
}
