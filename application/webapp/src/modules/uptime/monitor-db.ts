import {
  DeleteItemCommand,
  DeleteItemCommandInput,
  DynamoDBClient,
  paginateQuery,
  PutItemCommand,
  PutItemCommandInput,
  QueryCommandInput,
} from "@aws-sdk/client-dynamodb";
import { marshall, unmarshall } from "@aws-sdk/util-dynamodb";
import { UptimeMonitor } from "types";

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
    console.log(err);
    return [];
  }
}

export async function deleteMonitor(
  ddbClient: DynamoDBClient,
  tableName: string,
  monitorId: string,
  userId: string
) {
  try {
    const deleteItemCommandInput: DeleteItemCommandInput = {
      TableName: tableName,
      Key: { owner_id: { S: userId }, monitorId: { S: monitorId } },
    };
    const response = await ddbClient.send(
      new DeleteItemCommand(deleteItemCommandInput)
    );
    const statusCode = response.$metadata.httpStatusCode as number;
    if (statusCode >= 200 && statusCode < 300) return true;
    return false;
  } catch (err) {
    return false;
  }
}

// create = PUT
export async function createMonitor(
  ddbClient: DynamoDBClient,
  tableName: string,
  monitor: UptimeMonitor
) {
  try {
    const putItemCommandInput: PutItemCommandInput = {
      TableName: tableName,
      Item: marshall(monitor, {
        removeUndefinedValues: true,
        convertEmptyValues: true,
      }),
      ConditionExpression: "attribute_not_exists(monitor_id)", // avoid overwriting preexisting monitors
    };
    const response = await ddbClient.send(
      new PutItemCommand(putItemCommandInput)
    );
    const statusCode = response.$metadata.httpStatusCode as number;
    if (statusCode >= 200 && statusCode < 300) return true;
    return false;
  } catch (err) {
    return false;
  }
}

export async function updateMonitor(
  ddbClient: DynamoDBClient,
  tableName: string,
  monitor: UptimeMonitor
) {}
