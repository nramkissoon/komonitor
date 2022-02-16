import {
  DeleteItemCommand,
  DeleteItemCommandInput,
  QueryCommand,
  QueryCommandInput,
  UpdateItemCommand,
  UpdateItemCommandInput,
} from "@aws-sdk/client-dynamodb";
import { marshall, unmarshall } from "@aws-sdk/util-dynamodb";
import { createNewInvite, Team, TeamMember } from "utils";
import { ddbClient, env } from "../../../common/server-utils";

const TEAM_TABLE_NAME = env.USER_TABLE_NAME; // renaming for readability

export const getTeamById = async (id: string) => {
  try {
    const queryCommandInput: QueryCommandInput = {
      TableName: TEAM_TABLE_NAME,
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
    console.log(err);
    throw err;
  }
};

export const deleteUserById = async (id: string) => {
  try {
    const deleteItemCommandInput: DeleteItemCommandInput = {
      TableName: TEAM_TABLE_NAME,
      Key: { pk: { S: id }, sk: { S: id } },
    };
    const response = await ddbClient.send(
      new DeleteItemCommand(deleteItemCommandInput)
    );
    const statusCode = response.$metadata.httpStatusCode as number;
    if (statusCode >= 200 && statusCode < 300) return true;
    return false;
  } catch (err) {
    console.log(err);
    throw err;
  }
};

export const addTeamMember = async (teamMember: TeamMember, team: Team) => {
  try {
    for (let member of team.members) {
      if (member.user_id === teamMember.user_id) {
        throw new Error("user is already member");
      }
    }
    team.members.push(teamMember);
    const updateCommandInput: UpdateItemCommandInput = {
      TableName: TEAM_TABLE_NAME,
      ConditionExpression: "attribute_exists(pk)", // asserts that the user exists
      Key: {
        pk: { S: team.pk },
        sk: { S: team.sk },
      },
      ExpressionAttributeValues: {
        ":val": { L: team.members.map((m) => ({ M: marshall(m) })) },
      },
      UpdateExpression: "SET members = val",
    };

    const response = await ddbClient.send(
      new UpdateItemCommand(updateCommandInput)
    );
    const statusCode = response.$metadata.httpStatusCode as number;
    if (statusCode >= 200 && statusCode < 300) return true;

    // throw an error with the requestId for debugging
    throw new Error(response.$metadata.requestId);
  } catch (err) {
    console.log(err);
    throw err;
  }
};

export const removeTeamMember = async (teamMemberId: string, team: Team) => {
  try {
    const ids = team.members.map((m) => m.user_id);
    if (!ids.includes(teamMemberId)) throw new Error("user is not team member");
    const newMemberList = team.members.filter(
      (m) => m.user_id !== teamMemberId
    );
    const updateCommandInput: UpdateItemCommandInput = {
      TableName: TEAM_TABLE_NAME,
      ConditionExpression: "attribute_exists(pk)", // asserts that the user exists
      Key: {
        pk: { S: team.pk },
        sk: { S: team.sk },
      },
      ExpressionAttributeValues: {
        ":val": { L: newMemberList.map((m) => ({ M: marshall(m) })) },
      },
      UpdateExpression: "SET members = val",
    };

    const response = await ddbClient.send(
      new UpdateItemCommand(updateCommandInput)
    );
    const statusCode = response.$metadata.httpStatusCode as number;
    if (statusCode >= 200 && statusCode < 300) return true;

    // throw an error with the requestId for debugging
    throw new Error(response.$metadata.requestId);
  } catch (err) {
    console.log(err);
    throw err;
  }
};

export const createInvite = async (team: Team, email: string) => {
  try {
    for (let invite of team.invites) {
      if (invite.email === email)
        throw new Error("invite for email already exists");
    }
    team.invites.push(createNewInvite(email, team.id));
    const updateCommandInput: UpdateItemCommandInput = {
      TableName: TEAM_TABLE_NAME,
      ConditionExpression: "attribute_exists(pk)", // asserts that the user exists
      Key: {
        pk: { S: team.pk },
        sk: { S: team.sk },
      },
      ExpressionAttributeValues: {
        ":val": { L: team.invites.map((m) => ({ M: marshall(m) })) },
      },
      UpdateExpression: "SET invites = val",
    };

    const response = await ddbClient.send(
      new UpdateItemCommand(updateCommandInput)
    );
    const statusCode = response.$metadata.httpStatusCode as number;
    if (statusCode >= 200 && statusCode < 300) return true;

    // throw an error with the requestId for debugging
    throw new Error(response.$metadata.requestId);
  } catch (err) {
    console.log(err);
    throw err;
  }
};

export const removeInvite = async (team: Team, email: string) => {
  try {
    const emails = team.invites.map((i) => i.email);
    if (!emails.includes(email)) throw new Error("user is not team member");
    const newInviteList = team.invites.filter((i) => i.email !== email);
    const updateCommandInput: UpdateItemCommandInput = {
      TableName: TEAM_TABLE_NAME,
      ConditionExpression: "attribute_exists(pk)", // asserts that the user exists
      Key: {
        pk: { S: team.pk },
        sk: { S: team.sk },
      },
      ExpressionAttributeValues: {
        ":val": { L: newInviteList.map((m) => ({ M: marshall(m) })) },
      },
      UpdateExpression: "SET invites = val",
    };

    const response = await ddbClient.send(
      new UpdateItemCommand(updateCommandInput)
    );
    const statusCode = response.$metadata.httpStatusCode as number;
    if (statusCode >= 200 && statusCode < 300) return true;

    // throw an error with the requestId for debugging
    throw new Error(response.$metadata.requestId);
  } catch (err) {
    console.log(err);
    throw err;
  }
};
