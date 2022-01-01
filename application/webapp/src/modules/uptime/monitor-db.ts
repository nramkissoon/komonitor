import {
  DeleteItemCommand,
  DeleteItemCommandInput,
  DynamoDBClient,
  paginateQuery,
  PutItemCommand,
  PutItemCommandInput,
  QueryCommand,
  QueryCommandInput,
} from "@aws-sdk/client-dynamodb";
import { marshall, unmarshall } from "@aws-sdk/util-dynamodb";
import { UptimeMonitor } from "project-types";
import {
  getPreviousInvocationForAlertForMonitor,
  setInvocationOngoingToFalse,
} from "../alerts/invocations-db";

export async function getMonitorsForUser(
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
    const monitors = await getMonitorsForUser(ddbClient, tableName, userId);
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
    const putItemCommandInput: PutItemCommandInput = {
      TableName: tableName,
      Item: marshall(monitor, {
        removeUndefinedValues: true,
        convertEmptyValues: true,
        convertClassInstanceToMap: true,
      }),
      ConditionExpression: isUpdate
        ? "attribute_exists(monitor_id)" // ensure a monitor exists that can be updated
        : "attribute_not_exists(monitor_id)", // avoid overwriting preexisting monitors when creating a new monitor
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

export async function detachAlertFromMonitors(
  ddbClient: DynamoDBClient,
  monitorTableName: string,
  userId: string,
  alertId: string,
  alertInvocationTableName: string
) {
  try {
    const monitors = await getMonitorsForUser(
      ddbClient,
      monitorTableName,
      userId
    );
    const attachedMonitors: UptimeMonitor[] = [];
    for (let monitor of monitors) {
      if (monitor.alert_id === (alertId as string)) {
        attachedMonitors.push(monitor);
      }
    }

    // set all recent invocations to ongoing false
    const resetOngoingInvocationsPromises: Promise<boolean>[] = [];
    for (let monitor of attachedMonitors) {
      const mostRecentAlertInvocation =
        await getPreviousInvocationForAlertForMonitor(
          ddbClient,
          alertId,
          monitor.monitor_id,
          alertInvocationTableName
        );
      if (mostRecentAlertInvocation) {
        resetOngoingInvocationsPromises.push(
          setInvocationOngoingToFalse(
            ddbClient,
            mostRecentAlertInvocation,
            alertInvocationTableName
          )
        );
      }
    }
    let ongoingReset = true;
    if (resetOngoingInvocationsPromises.length > 0) {
      // check if all monitors are detached
      ongoingReset = (
        await Promise.all(resetOngoingInvocationsPromises)
      ).reduce((prev, next) => prev && next);
    }
    // TODO determine if we should throw error if ongoingReset is false

    const detachPromises: Promise<boolean>[] = [];
    // detach
    for (let monitor of attachedMonitors) {
      monitor.alert_id = undefined;
      monitor.failures_before_alert = undefined;
      detachPromises.push(
        putMonitor(ddbClient, monitorTableName, monitor, true)
      );
    }
    let detached = true;
    if (detachPromises.length > 0) {
      // check if all monitors are detached
      detached = (await Promise.all(detachPromises)).reduce(
        (prev, next) => prev && next
      );
    }

    return detached;
  } catch (err) {
    console.log(err);
    return false;
  }
}
