import {
  DynamoDBClient,
  paginateQuery,
  QueryCommandInput,
} from "@aws-sdk/client-dynamodb";
import { unmarshall } from "@aws-sdk/util-dynamodb";
import { AlertInvocation } from "project-types";
import { createAlertIdToInvocationArrayMap } from "./utils";

export async function getInvocationsForAlert(
  ddbClient: DynamoDBClient,
  alertId: string,
  tableName: string,
  timestampLsiName: string,
  since: number
) {
  try {
    const queryCommandInput: QueryCommandInput = {
      TableName: tableName,
      IndexName: timestampLsiName,
      ExpressionAttributeNames: { "#t": "timestamp" },
      KeyConditionExpression:
        "alert_id = :partitionkeyval AND #t >= :sortkeyval",
      ExpressionAttributeValues: {
        ":partitionkeyval": { S: alertId },
        ":sortkeyval": { N: since.toString() },
      },
    };
    const query = paginateQuery({ client: ddbClient }, queryCommandInput);
    const invocations: AlertInvocation[] = [];
    let done = false;
    while (!done) {
      const page = await query.next();
      done = page.done === undefined || page.done;
      const queryItems = page.value?.Items ? page.value.Items : [];
      queryItems.forEach((item) =>
        invocations.push(unmarshall(item) as AlertInvocation)
      );
    }
    return invocations;
  } catch (err) {
    console.error(err);
    // throw the err up to the API route level
    throw err;
  }
}

export async function getInvocationsByAlertIdByMonitorId(
  ddbClient: DynamoDBClient,
  alertId: string,
  monitorId: string,
  tableName: string,
  since: number
) {
  try {
    const queryCommandInput: QueryCommandInput = {
      TableName: tableName,
      ExpressionAttributeNames: { "#t": "timestamp" },
      KeyConditionExpression:
        "alert_id = :partitionkeyval AND begins_with(monitor_id, :sortkeyval)",
      ExpressionAttributeValues: {
        ":partitionkeyval": { S: alertId },
        ":sortkeyval": { S: monitorId },
        ":sinceval": { N: since.toString() },
      },
      FilterExpression: "#t >= :sinceval",
    };
    const query = paginateQuery({ client: ddbClient }, queryCommandInput);
    const invocations: AlertInvocation[] = [];
    let done = false;
    while (!done) {
      const page = await query.next();
      done = page.done === undefined || page.done;
      const queryItems = page.value?.Items ? page.value.Items : [];
      queryItems.forEach((item) =>
        invocations.push(unmarshall(item) as AlertInvocation)
      );
    }
    return invocations;
  } catch (err) {
    console.error(err);
    // throw the err up to the API route level
    throw err;
  }
}

export async function getInvocationsForMultipleAlerts(
  ddbClient: DynamoDBClient,
  alertIds: string[],
  tableName: string,
  timestampLsiName: string,
  since: number
) {
  try {
    const allInvocations: AlertInvocation[] = [];
    const promises = [];
    for (let id of alertIds) {
      promises.push(
        getInvocationsForAlert(
          ddbClient,
          id,
          tableName,
          timestampLsiName,
          since
        )
      );
    }
    const results = await Promise.allSettled(promises);
    for (let result of results) {
      if (result.status === "fulfilled") {
        allInvocations.push(...result.value);
      }
    }
    return createAlertIdToInvocationArrayMap(alertIds, allInvocations);
  } catch (err) {
    console.error(err);
    // throw the err up to the API route level
    throw err;
  }
}
