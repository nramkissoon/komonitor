import {
  DeleteItemCommand,
  DeleteItemCommandInput,
  DynamoDBClient,
  paginateQuery,
  PutItemCommand,
  PutItemCommandInput,
  QueryCommand,
  QueryCommandInput,
  UpdateItemCommand,
  UpdateItemCommandInput,
} from "@aws-sdk/client-dynamodb";
import { marshall, unmarshall } from "@aws-sdk/util-dynamodb";
import { Alert, AlertStates } from "project-types";

export async function getAlertsForUser(
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
    const alerts: Alert[] = [];
    let done = false;
    while (!done) {
      const page = await query.next();
      done = page.done === undefined || page.done;
      const queryItems = page.value?.Items ? page.value.Items : [];
      queryItems.forEach((item) => alerts.push(unmarshall(item) as Alert));
    }
    return alerts;
  } catch (err) {
    console.log(err);
    return [];
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

export async function deleteAlert(
  ddbClient: DynamoDBClient,
  tableName: string,
  alertId: string,
  userId: string
) {
  try {
    const deleteItemCommandInput: DeleteItemCommandInput = {
      TableName: tableName,
      Key: { owner_id: { S: userId }, alert_id: { S: alertId } },
    };
    const response = await ddbClient.send(
      new DeleteItemCommand(deleteItemCommandInput)
    );
    const statusCode = response.$metadata.httpStatusCode as number;
    if (statusCode >= 200 && statusCode < 300) return true;
    return false;
  } catch (err) {
    console.log(err);
    return false;
  }
}

export async function deleteAlertsForUser(
  ddbClient: DynamoDBClient,
  tableName: string,
  userId: string
) {
  try {
    const alerts = await getAlertsForUser(ddbClient, tableName, userId);
    const alertIds = alerts.map((alert) => alert.alert_id);
    for (let alertId of alertIds) {
      await deleteAlert(ddbClient, tableName, alertId, userId);
    }
  } catch (err) {
    console.log(err);
    return false;
  }
}

// create or update = PUT
export async function putAlert(
  ddbClient: DynamoDBClient,
  tableName: string,
  alert: Alert,
  isUpdate: boolean
) {
  try {
    const putItemCommandInput: PutItemCommandInput = {
      TableName: tableName,
      Item: marshall(alert, {
        removeUndefinedValues: true,
        convertEmptyValues: true,
      }),
      ConditionExpression: isUpdate
        ? "attribute_exists(alert_id)" // ensure a alert exists that can be updated
        : "attribute_not_exists(alert_id)", // avoid overwriting preexisting alerts when creating a new alert
    };
    const response = await ddbClient.send(
      new PutItemCommand(putItemCommandInput)
    );
    const statusCode = response.$metadata.httpStatusCode as number;
    if (statusCode >= 200 && statusCode < 300) return true;
    return false;
  } catch (err) {
    console.log(err);
    return false;
  }
}

export async function setAlertState(
  ddbClient: DynamoDBClient,
  tableName: string,
  userId: string,
  alertId: string,
  state: AlertStates
) {
  try {
    const updateCommandInput: UpdateItemCommandInput = {
      TableName: tableName,
      ConditionExpression: "attribute_exists(owner_id)", // asserts that the alert exists
      Key: {
        owner_id: { S: userId },
        alert_id: { S: alertId },
      },
      ExpressionAttributeValues: {
        ":state": { S: state },
      },
      UpdateExpression: "SET state = :state",
    };
    const response = await ddbClient.send(
      new UpdateItemCommand(updateCommandInput)
    );
    const statusCode = response.$metadata.httpStatusCode as number;
    if (statusCode >= 200 && statusCode < 300) return true;

    // throw an error with the requestId for debugging
    throw new Error(response.$metadata.requestId);
  } catch (err) {
    // TODO log
    throw err;
  }
}
