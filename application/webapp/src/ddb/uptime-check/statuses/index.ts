import { DynamoDBClient } from "@aws-sdk/client-dynamodb";

export function getStatuses(
  ddbClient: DynamoDBClient,
  monitorIds: string[],
  since: number
) {}
