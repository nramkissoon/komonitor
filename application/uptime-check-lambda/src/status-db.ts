import {
  DynamoDBClient,
  PutItemCommandInput,
  PutItemCommand,
} from "@aws-sdk/client-dynamodb";
import { marshall } from "@aws-sdk/util-dynamodb";
import { UptimeMonitorStatus } from "types";

export const writeStatusToDB = async (
  status: UptimeMonitorStatus
): Promise<boolean> => {
  const ddbClient = new DynamoDBClient({
    region: "us-east-1",
    apiVersion: "2012-08-10",
  });
  const tableName = process.env.MONITOR_STATUS_TABLE_NAME
    ? process.env.MONITOR_STATUS_TABLE_NAME
    : "dev_uptime_monitor_status";

  const item = marshall(status);

  const input: PutItemCommandInput = {
    TableName: tableName,
    Item: item,
  };

  const putItemCommand = new PutItemCommand(input);

  try {
    const result = await ddbClient.send(putItemCommand);
    return true;
  } catch (err) {
    return false;
  }
};
