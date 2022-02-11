import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { LambdaClient } from "@aws-sdk/client-lambda";

export const config = {
  ddbClient: new DynamoDBClient({ region: "us-east-1" }),
  lambdaClient: new LambdaClient({ region: process.env.REGION as string }),
  ALERT_LAMBDA_NAME: process.env.ALERT_LAMBDA_NAME as string,
  alertInvocationTableName: process.env.ALERT_INVOCATION_TABLE_NAME as string,
  userTableName: process.env.USER_TABLE_NAME as string,
};

export const ddbClient = new DynamoDBClient({
  region: "us-east-1",
  apiVersion: "2012-08-10",
});
