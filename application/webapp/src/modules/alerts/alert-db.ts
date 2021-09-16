import {
  DynamoDBClient,
  paginateQuery,
  QueryCommandInput,
} from "@aws-sdk/client-dynamodb";
import { unmarshall } from "@aws-sdk/util-dynamodb";
import { Alert } from "types";

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
      const queryItems = page.value.Items ? page.value.Items : [];
      queryItems.forEach((item) => alerts.push(unmarshall(item) as Alert));
    }
    return alerts;
  } catch (err) {
    return [];
  }
}
