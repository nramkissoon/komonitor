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
import { UptimeMonitor } from "utils";
import { createProjectIdToMonitorArrayMap } from "./utils";

export async function getMonitorsForOwner(
  ddbClient: DynamoDBClient,
  tableName: string,
  ownerId: string
) {
  try {
    const queryCommandInput: QueryCommandInput = {
      TableName: tableName,
      KeyConditionExpression: "owner_id = :partitionkeyval",
      ExpressionAttributeValues: {
        ":partitionkeyval": { S: ownerId },
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

export const getMonitorsForProjectForOwner = async (
  ddbClient: DynamoDBClient,
  tableName: string,
  GsiName: string,
  projectId: string,
  ownerId: string
) => {
  try {
    const queryCommandInput: QueryCommandInput = {
      TableName: tableName,
      KeyConditionExpression:
        "owner_id = :partitionKeyVal AND project_id = :sortKeyVal",
      ExpressionAttributeValues: {
        ":partitionKeyVal": { S: ownerId },
        ":sortKeyVal": { S: projectId },
      },
      IndexName: GsiName,
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
    throw err as Error;
  }
};

export const getMonitorsForMultipleProjectsForOwner = async (
  ddbClient: DynamoDBClient,
  tableName: string,
  GsiName: string,
  projectIds: string[],
  ownerId: string
) => {
  const allMonitors: UptimeMonitor[] = [];
  const promises = [];
  for (let id of projectIds) {
    promises.push(
      getMonitorsForProjectForOwner(ddbClient, tableName, GsiName, id, ownerId)
    );
  }
  const results = await Promise.allSettled(promises);
  for (let result of results) {
    if (result.status === "fulfilled") {
      allMonitors.push(...result.value);
    } else {
      console.error("error getMonitorsForMultipleProjectsForOwner");
    }
  }

  return createProjectIdToMonitorArrayMap(projectIds, allMonitors);
};

export async function getMonitorForUserByMonitorId(
  ddbClient: DynamoDBClient,
  tableName: string,
  userId: string,
  monitorId: string
) {
  try {
    const queryCommandInput: QueryCommandInput = {
      TableName: tableName,
      KeyConditionExpression:
        "owner_id = :partitionkeyval AND monitor_id = :sortkeyval",
      ExpressionAttributeValues: {
        ":partitionkeyval": { S: userId },
        ":sortkeyval": { S: monitorId },
      },
    };
    const response = await ddbClient.send(new QueryCommand(queryCommandInput));
    if (response?.Count === 1 && response.Items) {
      return unmarshall(response.Items[0]) as UptimeMonitor;
    }
  } catch (err) {
    return null;
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
      Key: { owner_id: { S: userId }, monitor_id: { S: monitorId } },
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

export async function deleteAllMonitorsForUser(
  ddbClient: DynamoDBClient,
  tableName: string,
  userId: string
) {
  try {
    const monitors = await getMonitorsForOwner(ddbClient, tableName, userId);
    const monitorIds = monitors.map((monitor) => monitor.monitor_id);
    for (let monitorId of monitorIds) {
      await deleteMonitor(ddbClient, tableName, monitorId, userId);
    }
  } catch (err) {
    console.log(err);
    return false;
  }
}

// create or update = PUT
export async function putMonitor(
  ddbClient: DynamoDBClient,
  tableName: string,
  monitor: UptimeMonitor,
  isUpdate: boolean
) {
  try {
    // check if monitor has no alert channels -> set alert to undefined
    if (monitor.alert && monitor.alert.channels.length === 0) {
      monitor.alert = undefined;
    }

    const putItemCommandInput: PutItemCommandInput = {
      TableName: tableName,
      Item: marshall(monitor, {
        removeUndefinedValues: true,
        convertEmptyValues: true,
        convertClassInstanceToMap: true,
      }),
      ConditionExpression: isUpdate
        ? "attribute_exists(monitor_id) AND attribute_exists(owner_id)" // ensure a monitor exists that can be updated
        : "attribute_not_exists(monitor_id) AND attribute_not_exists(owner_id)", // avoid overwriting preexisting monitors when creating a new monitor
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

export async function transferMonitorToProject(
  ddbClient: DynamoDBClient,
  tableName: string,
  monitorId: string,
  ownerId: string,
  newProjectId: string
) {
  try {
    const updateItemCommandInput: UpdateItemCommandInput = {
      TableName: tableName,
      Key: {
        owner_id: { S: ownerId },
        monitor_id: { S: monitorId },
      },
      UpdateExpression: "SET project_id = :new",
      ExpressionAttributeValues: {
        ":new": { S: newProjectId },
      },
    };
    const response = await ddbClient.send(
      new UpdateItemCommand(updateItemCommandInput)
    );
    const statusCode = response.$metadata.httpStatusCode as number;
    if (statusCode >= 200 && statusCode < 300) return true;
    return false;
  } catch (err) {
    console.log(err);
    throw err as Error;
  }
}

export async function transferMultipleMonitorsToProject(
  ddbClient: DynamoDBClient,
  tableName: string,
  originalId: string,
  ownerId: string,
  newProjectId: string,
  gsiName: string
) {
  try {
    const monitorIds = (
      await getMonitorsForProjectForOwner(
        ddbClient,
        tableName,
        gsiName,
        originalId,
        ownerId
      )
    ).map((monitor) => monitor.monitor_id);
    const updatePromises = [];
    for (let id of monitorIds) {
      updatePromises.push(
        transferMonitorToProject(
          ddbClient,
          tableName,
          id,
          ownerId,
          newProjectId
        )
      );
    }

    const results = await Promise.allSettled(updatePromises);
    for (let result of results) {
      if (result.status === "rejected")
        throw new Error("rejected project transfer");
    }
    return true;
  } catch (err) {
    console.log(err);
    throw err as Error;
  }
}
