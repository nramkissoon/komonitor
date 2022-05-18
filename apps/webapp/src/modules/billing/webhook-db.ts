import {
  DynamoDBClient,
  PutItemCommand,
  PutItemCommandInput,
} from "@aws-sdk/client-dynamodb";
import { marshall } from "@aws-sdk/util-dynamodb";
import Stripe from "stripe";

export async function writeStripeEvent(
  ddbClient: DynamoDBClient,
  tableName: string,
  event: Stripe.Event
) {
  try {
    const putItemCommandInput: PutItemCommandInput = {
      TableName: tableName,
      Item: marshall(event),
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
