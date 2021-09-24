import {
  DeleteItemCommand,
  DeleteItemCommandInput,
  DynamoDBClient,
  QueryCommand,
  QueryCommandInput,
  UpdateItemCommand,
  UpdateItemCommandInput,
} from "@aws-sdk/client-dynamodb";
import { unmarshall } from "@aws-sdk/util-dynamodb";
import { User } from "project-types";
import { PLAN_PRODUCT_IDS } from "../billing/plans";

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

export async function deleteUserById(
  ddbClient: DynamoDBClient,
  userTableName: string,
  id: string
) {
  try {
    const deleteItemCommandInput: DeleteItemCommandInput = {
      TableName: userTableName,
      Key: { pk: { S: "USER#" + id }, sk: { S: "USER#" + id } },
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

export function deleteAllUserDataById() {} // TODO

export async function updateUserIfExists(
  ddbClient: DynamoDBClient,
  userTableName: string,
  userId: string,
  updateItemCommandInput: UpdateItemCommandInput
): Promise<boolean> {
  try {
    const exists =
      (await getUserById(ddbClient, userTableName, userId)) !== undefined;
    if (exists) {
      const response = await ddbClient.send(
        new UpdateItemCommand(updateItemCommandInput)
      );
      const statusCode = response.$metadata.httpStatusCode as number;
      return statusCode >= 200 && statusCode < 300;
    }
    return false;
  } catch (err) {
    return false;
  }
}

export async function getServicePlanProductIdForUser(
  ddbClient: DynamoDBClient,
  userTableName: string,
  userId: string
): Promise<string> {
  try {
    const user = await getUserById(ddbClient, userTableName, userId);
    if (!user) {
      throw new Error("undefined user");
    }
    if (user.product_id && user.product_id !== null) return user.product_id;
    return PLAN_PRODUCT_IDS.FREE;
  } catch (err) {
    throw err;
  }
}

export async function setServicePlanProductIdForUser(
  ddbClient: DynamoDBClient,
  userTableName: string,
  userId: string,
  servicePlanProductId: string
) {
  try {
    const updateCommandInput: UpdateItemCommandInput = {
      TableName: userTableName,
      ConditionExpression: "attribute_exists(pk)", // asserts that the user exists
      Key: {
        pk: { S: "USER#" + userId },
        sk: { S: "USER#" + userId },
      },
      ExpressionAttributeValues: {
        ":p": { S: servicePlanProductId },
      },
      UpdateExpression: "SET product_id = :p",
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

export async function setStripCustomerIdForUser(
  ddbClient: DynamoDBClient,
  userTableName: string,
  userId: string,
  customerId: string
) {
  try {
    const updateCommandInput: UpdateItemCommandInput = {
      TableName: userTableName,
      ConditionExpression: "attribute_exists(pk)", // asserts that the user exists
      Key: {
        pk: { S: "USER#" + userId },
        sk: { S: "USER#" + userId },
      },
      ExpressionAttributeValues: {
        ":p": { S: customerId },
      },
      UpdateExpression: "SET customer_id = :p",
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
