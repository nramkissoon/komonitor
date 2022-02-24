import {
  PutItemCommand,
  PutItemCommandInput,
  QueryCommand,
  QueryCommandInput,
} from "@aws-sdk/client-dynamodb";
import { marshall, unmarshall } from "@aws-sdk/util-dynamodb";
import { AlertInvocation, Team, UptimeMonitorStatus, User } from "utils";
import { config, ddbClient } from "./config";

export const writeStatusToDB = async (
  status: UptimeMonitorStatus
): Promise<boolean> => {
  const tableName = process.env.MONITOR_STATUS_TABLE_NAME
    ? process.env.MONITOR_STATUS_TABLE_NAME
    : "dev_uptime_monitor_status";

  const item = marshall(status, {
    removeUndefinedValues: true,
    convertClassInstanceToMap: true,
  });

  const input: PutItemCommandInput = {
    TableName: tableName,
    Item: item,
  };

  const putItemCommand = new PutItemCommand(input);

  try {
    const result = await ddbClient.send(putItemCommand);
    return true;
  } catch (err) {
    console.log(err);
    return false;
  }
};

export async function getPreviousAlertInvocationForMonitor(
  monitorId: string,
  tableName: string
) {
  try {
    const queryCommandInput: QueryCommandInput = {
      TableName: tableName,
      KeyConditionExpression: "monitor_id = :partitionkeyval",
      ExpressionAttributeValues: {
        ":partitionkeyval": { S: monitorId },
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

export async function getUserWebhookSecret(userId: string) {
  try {
    const queryCommandInput: QueryCommandInput = {
      TableName: config.userTableName,
      KeyConditionExpression: "pk = :partitionkeyval AND sk = :sortkeyval",
      ExpressionAttributeValues: {
        ":partitionkeyval": { S: "USER#" + userId },
        ":sortkeyval": { S: "USER#" + userId },
      },
    };
    const response = await ddbClient.send(new QueryCommand(queryCommandInput));
    if (response.Count && response.Count > 0 && response.Items) {
      const user = unmarshall(response.Items[0]) as User;
      if (user.product_id && user.product_id !== "FREE") {
        // must be paid plan
        return user.webhook_secret;
      }
      return;
    }
  } catch (err) {
    console.error(err);
    return;
  }
}

export async function writeAlertInvocation(
  tableName: string,
  invocation: AlertInvocation
) {
  try {
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

export async function getUserById(id: string): Promise<User | undefined> {
  try {
    const queryCommandInput: QueryCommandInput = {
      TableName: config.userTableName,
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

export const getTeamById = async (id: string): Promise<Team | undefined> => {
  try {
    const queryCommandInput: QueryCommandInput = {
      TableName: config.userTableName,
      KeyConditionExpression: "pk = :partitionkeyval AND sk = :sortkeyval",
      ExpressionAttributeValues: {
        ":partitionkeyval": { S: id },
        ":sortkeyval": { S: id },
      },
    };
    const response = await ddbClient.send(new QueryCommand(queryCommandInput));
    if (response.Count && response.Count > 0 && response.Items) {
      const team = unmarshall(response.Items[0]) as Team;
      return team;
    }
  } catch (err) {
    return;
  }
};

export const getWebhookSecretFromOwnerObj = (owner: Team | User) => {
  if (owner.product_id && owner.product_id !== "FREE") {
    // must be paid plan
    return owner.webhook_secret;
  }
  return;
};

// Need to check for both user and strings because of brain dead db data structure
export const getOwnerById = async (
  id: string
): Promise<User | Team | undefined> => {
  const user = getUserById(id);
  const team = getTeamById(id);

  const u = await user;
  if (u !== undefined) return u;
  const t = await team;
  if (t !== undefined) return t;

  return;
};
