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
import { User } from "types";
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
): Promise<string | undefined> {
  try {
    const user = await getUserById(ddbClient, userTableName, userId);
    if (!user) {
      throw new Error("undefined user");
    }
    if (user.product_id) return user.product_id;
    return PLAN_PRODUCT_IDS.FREE;
  } catch (err) {
    return;
  }
}
