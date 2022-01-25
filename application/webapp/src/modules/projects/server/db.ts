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
import { Project } from "project-types";
import { deleteMonitor } from "../../uptime/monitor-db";

export async function getProjectsForOwner(
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
    const projects: Project[] = [];
    let done = false;
    while (!done) {
      const page = await query.next();
      done = page.done === undefined || page.done;
      const queryItems = page.value?.Items ? page.value.Items : [];
      queryItems.forEach((item) => projects.push(unmarshall(item) as Project));
    }
    return projects;
  } catch (err) {
    console.log(err);
    throw err as Error;
  }
}

export async function getProjectForOwnerByProjectId(
  ddbClient: DynamoDBClient,
  tableName: string,
  ownerId: string,
  projectId: string
) {
  try {
    const queryCommandInput: QueryCommandInput = {
      TableName: tableName,
      KeyConditionExpression:
        "owner_id = :partitionkeyval AND project_id = :sortkeyval",
      ExpressionAttributeValues: {
        ":partitionkeyval": { S: ownerId },
        ":sortkeyval": { S: projectId },
      },
    };
    const response = await ddbClient.send(new QueryCommand(queryCommandInput));
    if (response?.Count === 1 && response.Items) {
      return unmarshall(response.Items[0]) as Project;
    }
    throw new Error("project not in db");
  } catch (err) {
    console.log(err);
    throw err as Error;
  }
}

export async function deleteProjectAndAssociatedAssets(
  ddbClient: DynamoDBClient,
  projectTableName: string,
  uptimeMonitorTableName: string,
  ownerId: string,
  projectId: string
) {
  try {
    const project = await getProjectForOwnerByProjectId(
      ddbClient,
      projectTableName,
      ownerId,
      projectId
    );

    if (!project) throw new Error("project not found for deletion");

    const uptimeMonitorIds = project.uptime_monitors;

    const deletionPromises: Promise<boolean>[] = [];

    for (let id of uptimeMonitorIds) {
      deletionPromises.push(
        deleteMonitor(ddbClient, uptimeMonitorTableName, id, ownerId)
      );
    }

    const results = await Promise.allSettled(deletionPromises);
    for (let result of results) {
      if (result.status === "rejected" || result.value === false) {
        throw new Error("could not delete all monitors for project");
      }
    }

    const deleteItemCommandInput: DeleteItemCommandInput = {
      TableName: projectTableName,
      Key: { owner_id: { S: ownerId }, project_id: { S: projectId } },
    };
    const response = await ddbClient.send(
      new DeleteItemCommand(deleteItemCommandInput)
    );
    const statusCode = response.$metadata.httpStatusCode as number;
    if (statusCode >= 200 && statusCode < 300) return true;
    throw new Error("Delete command failed to delete project");
  } catch (err) {
    console.log(err);
    throw err as Error;
  }
}

export async function deleteProject(
  ddbClient: DynamoDBClient,
  projectTableName: string,
  ownerId: string,
  projectId: string
) {
  try {
    const deleteItemCommandInput: DeleteItemCommandInput = {
      TableName: projectTableName,
      Key: { owner_id: { S: ownerId }, project_id: { S: projectId } },
    };
    const response = await ddbClient.send(
      new DeleteItemCommand(deleteItemCommandInput)
    );
    const statusCode = response.$metadata.httpStatusCode as number;
    if (statusCode >= 200 && statusCode < 300) return true;
    throw new Error("delete item command error");
  } catch (err) {
    console.log.apply(err);
    throw err as Error;
  }
}

export async function createProject(
  ddbClient: DynamoDBClient,
  projectTableName: string,
  project: Project
) {
  try {
    const putItemCommandInput: PutItemCommandInput = {
      TableName: projectTableName,
      Item: marshall(project, {
        removeUndefinedValues: true,
        convertEmptyValues: true,
        convertClassInstanceToMap: true,
      }),
      ConditionExpression:
        "attribute_not_exists(project_id) AND attribute_not_exists(owner_id)",
    };

    const response = await ddbClient.send(
      new PutItemCommand(putItemCommandInput)
    );
    const statusCode = response.$metadata.httpStatusCode as number;
    if (statusCode >= 200 && statusCode < 300) return true;
    throw new Error("put item command error");
  } catch (err) {
    throw err as Error;
  }
}

export async function updateProjectId(
  ddbClient: DynamoDBClient,
  projectTableName: string,
  project: Project,
  oldId: string
) {
  try {
    const updateItemCommandInput: UpdateItemCommandInput = {
      TableName: projectTableName,
      Key: {
        project_id: { S: oldId },
        owner_id: { S: project.owner_id },
      },
      UpdateExpression: "SET project_id = :new",
      ExpressionAttributeValues: {
        ":new": { S: project.project_id },
      },
    };

    const response = await ddbClient.send(
      new UpdateItemCommand(updateItemCommandInput)
    );
    const statusCode = response.$metadata.httpStatusCode as number;
    if (statusCode >= 200 && statusCode < 300) return true;
    throw new Error("update item command error");
  } catch (err) {
    throw err as Error;
  }
}
