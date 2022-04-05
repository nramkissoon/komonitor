import {
  paginateQuery,
  QueryCommand,
  QueryCommandInput,
} from "@aws-sdk/client-dynamodb";
import { unmarshall } from "@aws-sdk/util-dynamodb";
import { StatusPage, StatusPageIncident } from "utils";
import { ddbClient, env } from "../../../common/server-utils";

export const getStatusPagesByOwnerId = async (id: string) => {
  try {
    const queryCommandInput: QueryCommandInput = {
      TableName: env.STATUS_PAGE_TABLE_NAME,
      KeyConditionExpression: "pk = :partitionkeyval",
      ExpressionAttributeValues: {
        ":partitionkeyval": { S: ["PAGE", id].join("#") },
      },
    };
    const query = paginateQuery({ client: ddbClient }, queryCommandInput);
    const statusPages: StatusPage[] = [];
    let done = false;
    while (!done) {
      const page = await query.next();
      done = page.done === undefined || page.done;
      const queryItems = page.value?.Items ? page.value.Items : [];
      queryItems.forEach((item) =>
        statusPages.push(unmarshall(item) as StatusPage)
      );
    }
    return statusPages;
  } catch (err) {
    console.log(err);
    return [];
  }
};

export const getStatusPagesByOwnerIdProjectId = async (
  ownerId: string,
  projectId: string
) => {
  try {
    const queryCommandInput: QueryCommandInput = {
      TableName: env.STATUS_PAGE_TABLE_NAME,
      KeyConditionExpression:
        "pk = :partitionkeyval AND begins_with(sk, :projectId)",
      ExpressionAttributeValues: {
        ":partitionkeyval": { S: ["PAGE", ownerId].join("#") },
        ":projectId": { S: projectId },
      },
    };
    const query = paginateQuery({ client: ddbClient }, queryCommandInput);
    const statusPages: StatusPage[] = [];
    let done = false;
    while (!done) {
      const page = await query.next();
      done = page.done === undefined || page.done;
      const queryItems = page.value?.Items ? page.value.Items : [];
      queryItems.forEach((item) =>
        statusPages.push(unmarshall(item) as StatusPage)
      );
    }
    return statusPages;
  } catch (err) {
    console.log(err);
    return [];
  }
};

export const getStatusPageByOwnerIdProjectIdPageId = async ({
  ownerId,
  projectId,
  pageId,
}: {
  ownerId: string;
  projectId: string;
  pageId: string;
}) => {
  try {
    const queryCommandInput: QueryCommandInput = {
      TableName: env.STATUS_PAGE_TABLE_NAME,
      KeyConditionExpression: "pk = :partitionkeyval AND sk = :sortkeyval",
      ExpressionAttributeValues: {
        ":partitionkeyval": { S: ["PAGE", ownerId].join("#") },
        ":sortkeyval": { S: [projectId, pageId].join("#") },
      },
    };
    const query = paginateQuery({ client: ddbClient }, queryCommandInput);
    const statusPages: StatusPage[] = [];
    let done = false;
    while (!done) {
      const page = await query.next();
      done = page.done === undefined || page.done;
      const queryItems = page.value?.Items ? page.value.Items : [];
      queryItems.forEach((item) =>
        statusPages.push(unmarshall(item) as StatusPage)
      );
    }
    return statusPages;
  } catch (err) {
    console.log(err);
    return [];
  }
};

export const getStatusPageByUUID = async (uuid: string) => {
  try {
    const queryCommandInput: QueryCommandInput = {
      TableName: env.STATUS_PAGE_TABLE_NAME,
      KeyConditionExpression: "pk = :partitionkeyval",
      ExpressionAttributeValues: {
        ":partitionkeyval": { S: uuid },
      },
      IndexName: env.STATUS_PAGE_TABLE_UUID_GSI_NAME,
    };
    const response = await ddbClient.send(new QueryCommand(queryCommandInput));
    if (response?.Count === 1 && response.Items) {
      return unmarshall(response.Items[0]) as StatusPage;
    }
  } catch (err) {
    return null;
  }
};

export const getIncidentsByStatusPageId = async (
  pageId: string,
  timestamp: number
) => {
  try {
    const queryCommandInput: QueryCommandInput = {
      TableName: env.STATUS_PAGE_TABLE_NAME,
      ExpressionAttributeNames: { "#t": "timestamp" },
      KeyConditionExpression:
        "monitor_id = :partitionkeyval AND #t >= :sortkeyval",
      ExpressionAttributeValues: {
        ":partitionkeyval": { S: ["INCIDENT", pageId].join("#") },
        ":sortkeyval": { S: timestamp.toString() },
      },
      ScanIndexForward: false,
    };
    const query = paginateQuery({ client: ddbClient }, queryCommandInput);
    const statuses: StatusPageIncident[] = [];
    let done = false;
    while (!done) {
      const page = await query.next();
      done = page.done === undefined || page.done;
      const queryItems = page.value?.Items ? page.value.Items : [];
      queryItems.forEach((item) =>
        statuses.push(unmarshall(item) as StatusPageIncident)
      );
    }
    return statuses;
  } catch (err) {
    console.error(err);
    return [];
  }
};

export const saveStatusPage = async () => {};

export const updateStatusPage = async () => {};

export const deleteStatusPage = async () => {};
