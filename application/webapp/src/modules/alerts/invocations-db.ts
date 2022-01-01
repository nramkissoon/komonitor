import {
  DynamoDBClient,
  paginateQuery,
  PutItemCommand,
  PutItemCommandInput,
  QueryCommand,
  QueryCommandInput,
} from "@aws-sdk/client-dynamodb";
import { marshall, unmarshall } from "@aws-sdk/util-dynamodb";
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

export async function setInvocationOngoingToFalse(
  ddbClient: DynamoDBClient,
  invocation: AlertInvocation,
  tableName: string
) {
  try {
    invocation.ongoing = false;
    const putItemCommandInput: PutItemCommandInput = {
      TableName: tableName,
      Item: marshall(invocation, {
        removeUndefinedValues: true,
        convertEmptyValues: true,
      }),
    };
    const response = await ddbClient.send(
      new PutItemCommand(putItemCommandInput)
    );
    const statusCode = response.$metadata.httpStatusCode as number;
    if (statusCode >= 200 && statusCode < 300) return true;
    return false;
  } catch (err) {
    console.error(err);
    return false;
  }
}

export async function getPreviousInvocationForAlertForMonitor(
  ddbClient: DynamoDBClient,
  alertId: string,
  monitorId: string,
  tableName: string
) {
  try {
    const queryCommandInput: QueryCommandInput = {
      TableName: tableName,
      KeyConditionExpression:
        "alert_id = :partitionkeyval and begins_with(monitor_id_timestamp, :monitorId)",
      ExpressionAttributeValues: {
        ":partitionkeyval": { S: alertId },
        ":monitorId": { S: monitorId },
      },
      ScanIndexForward: false,
      Limit: 1,
    };
    const response = await ddbClient.send(new QueryCommand(queryCommandInput));
    if (response.Count && response.Count > 0 && response.Items) {
      const invocation = unmarshall(response.Items[0]) as AlertInvocation;
      return invocation;
    }
    return;
  } catch (err) {
    console.error(err);
    return;
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
