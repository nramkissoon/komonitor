import {
  DeleteItemCommand,
  DeleteItemCommandInput,
  QueryCommand,
  QueryCommandInput,
  TransactWriteItemsCommand,
  TransactWriteItemsInput,
  UpdateItemCommand,
  UpdateItemCommandInput,
} from "@aws-sdk/client-dynamodb";
import { marshall, unmarshall } from "@aws-sdk/util-dynamodb";
import { Installation } from "@slack/oauth";
import {
  createNewInvite,
  SlackInstallation,
  Team,
  TeamPermissionLevel,
  User,
} from "utils";
import { ddbClient, env } from "../../../common/server-utils";
import { deleteAllProjectsAndAssociatedAssetsForOwner } from "../../projects/server/db";
import { getUserById } from "../../user/user-db";

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

export const createTeam = async (id: string, adminId: string) => {
  try {
    const team: Team = {
      type: "TEAM",
      members: [{ user_id: adminId, permission_level: "admin" }],
      integrations: [],
      invites: [],
      pk: id,
      sk: id,
      id: id,
    };

    const user = await getUserById(ddbClient, env.USER_TABLE_NAME, adminId);

    if (!user) throw new Error("user id not valid");

    if (!user.teams) {
      user.teams = [];
    }
    user.teams.push(team.id);

    const transactWriteInput: TransactWriteItemsInput = {
      TransactItems: [
        {
          Put: {
            TableName: TEAM_TABLE_NAME,
            Item: marshall(team),
            ConditionExpression:
              "attribute_not_exists(pk) AND attribute_not_exists(sk)", // avoid overwriting preexisting teams when creating a new monitor
          },
        },
        {
          Update: {
            TableName: env.USER_TABLE_NAME,
            ConditionExpression:
              "attribute_exists(pk) AND attribute_exists(sk)", // asserts that the user exists
            Key: {
              pk: { S: "USER#" + user.id },
              sk: { S: "USER#" + user.id },
            },
            ExpressionAttributeValues: {
              ":i": {
                L: user.teams.map((t) => ({ S: t })),
              },
            },
            UpdateExpression: "SET teams = :i",
          },
        },
      ],
    };

    const response = await ddbClient.send(
      new TransactWriteItemsCommand(transactWriteInput)
    );
    const statusCode = response.$metadata.httpStatusCode as number;
    if (statusCode >= 200 && statusCode < 300) return true;
    return false;
  } catch (err) {
    console.log(err);
    throw err;
  }
};

export const deleteTeamAndAssociatedAssets = async (id: string) => {
  try {
    const assetsDeleted = await deleteAllProjectsAndAssociatedAssetsForOwner(
      ddbClient,
      env.PROJECTS_TABLE_NAME,
      env.UPTIME_MONITOR_TABLE_NAME,
      env.UPTIME_MONITOR_TABLE_PID_GSI_NAME,
      id
    );

    if (!assetsDeleted)
      console.log("assets failed to be deleted for team:", id);

    // TODO DELETE ALL REFERENCES IN USERS
    const team = await getTeamById(id);
    const memberRemovalPromises = [];
    if (team) {
      for (let member of team?.members) {
        let user = await getUserById(
          ddbClient,
          env.USER_TABLE_NAME,
          member.user_id
        );
        if (user) memberRemovalPromises.push(removeTeamMember(user, team));
      }
    }

    const membersRemoved = await Promise.allSettled(memberRemovalPromises);

    return await deleteTeamById(id);
  } catch (err) {
    console.log(err);
    throw err;
  }
};

export const deleteTeamById = async (id: string) => {
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

export const addTeamMember = async (
  user: User,
  team: Team,
  permission: TeamPermissionLevel
) => {
  try {
    for (let member of team.members) {
      if (member.user_id === user.id) {
        throw new Error("user is already member");
      }
    }
    team.members.push({ user_id: user.id, permission_level: permission });

    if (!user.teams) {
      user.teams = [];
    }
    user.teams.push(team.id);

    const transactWriteInput: TransactWriteItemsInput = {
      TransactItems: [
        {
          Update: {
            TableName: TEAM_TABLE_NAME,
            ConditionExpression: "attribute_exists(pk)", // asserts that the user exists
            Key: {
              pk: { S: team.pk },
              sk: { S: team.sk },
            },
            ExpressionAttributeValues: {
              ":val": { L: team.members.map((m) => ({ M: marshall(m) })) },
            },
            UpdateExpression: "SET members = :val",
          },
        },
        {
          Update: {
            TableName: env.USER_TABLE_NAME,
            ConditionExpression: "attribute_exists(pk)", // asserts that the user exists
            Key: {
              pk: { S: "USER#" + user.id },
              sk: { S: "USER#" + user.id },
            },
            ExpressionAttributeValues: {
              ":i": {
                L: user.teams.map((t) => ({ S: t })),
              },
            },
            UpdateExpression: "SET teams = :i",
          },
        },
      ],
    };

    const response = await ddbClient.send(
      new TransactWriteItemsCommand(transactWriteInput)
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

export const removeTeamMember = async (teamMember: User, team: Team) => {
  try {
    const ids = team.members.map((m) => m.user_id);
    if (!ids.includes(teamMember.id))
      throw new Error("user is not team member");
    const newMemberList = team.members.filter(
      (m) => m.user_id !== teamMember.id
    );

    if (!teamMember.teams) throw new Error("no teams this should never happen");

    const newTeamList = teamMember.teams.filter((t) => t !== team.id);

    const transactWriteInput: TransactWriteItemsInput = {
      TransactItems: [
        {
          Update: {
            TableName: TEAM_TABLE_NAME,
            ConditionExpression: "attribute_exists(pk)", // asserts that the user exists
            Key: {
              pk: { S: team.pk },
              sk: { S: team.sk },
            },
            ExpressionAttributeValues: {
              ":val": { L: newMemberList.map((m) => ({ M: marshall(m) })) },
            },
            UpdateExpression: "SET members = :val",
          },
        },
        {
          Update: {
            TableName: env.USER_TABLE_NAME,
            ConditionExpression: "attribute_exists(pk)", // asserts that the user exists
            Key: {
              pk: { S: "USER#" + teamMember.id },
              sk: { S: "USER#" + teamMember.id },
            },
            ExpressionAttributeValues: {
              ":i": {
                L: newTeamList.map((t) => ({ S: t })),
              },
            },
            UpdateExpression: "SET teams = :i",
          },
        },
      ],
    };

    const response = await ddbClient.send(
      new TransactWriteItemsCommand(transactWriteInput)
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
      UpdateExpression: "SET invites = :val",
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
      UpdateExpression: "SET invites = :val",
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

export const provisionSubscriptionForTeam = async ({
  teamId,
  subscriptionId,
  subscriptionStatus,
  currentPeriodEnd,
  customerId,
  productId,
}: {
  teamId: string;
  subscriptionId: string;
  subscriptionStatus: string;
  currentPeriodEnd: number;
  customerId: string;
  productId: string;
}) => {
  try {
    const updateCommandInput: UpdateItemCommandInput = {
      TableName: TEAM_TABLE_NAME,
      ConditionExpression: "attribute_exists(pk) AND attribute_exists(sk)", // asserts that the team
      Key: {
        pk: { S: teamId },
        sk: { S: teamId },
      },
      ExpressionAttributeValues: {
        ":p": { S: productId },
        ":i": { S: subscriptionId },
        ":s": { S: subscriptionStatus },
        ":c": { N: currentPeriodEnd.toString() },
        ":h": { S: customerId },
      },
      UpdateExpression:
        "SET product_id=:p, subscription_id=:i, current_period_end=:c, subscription_status=:s, customer_id=:h",
    };

    const response = await ddbClient.send(
      new UpdateItemCommand(updateCommandInput)
    );
    const statusCode = response.$metadata.httpStatusCode as number;
    if (statusCode >= 200 && statusCode < 300) return true;

    // throw an error with the requestId for debugging
    throw new Error(response.$metadata.requestId);
  } catch (err) {
    console.error(err);
    throw err;
  }
};

export const userIsAdmin = (userId: string, team: Team) => {
  for (let member of team.members) {
    if (member.user_id === userId && member.permission_level === "admin") {
      return true;
    }
  }
  return false;
};

export const userIsMember = (userId: string, team: Team) => {
  for (let member of team.members) {
    if (member.user_id === userId) {
      return true;
    }
  }
  return false;
};

export const userCanEdit = (userId: string, team: Team) => {
  for (let member of team.members) {
    if (
      member.user_id === userId &&
      (member.permission_level === "admin" ||
        member.permission_level === "edit")
    ) {
      return true;
    }
  }
  return false;
};

export const getTeamSlackInstallations = async (id: string) => {
  const team = await getTeamById(id);
  if (!team) return [];
  return getTeamSlackInstallationsFromTeamObj(team);
};

export const getTeamSlackInstallationsFromTeamObj = (team: Team) => {
  return team.integrations
    .filter((integration) => integration.type === "Slack")
    .map((integration) => integration.data);
};

export const addTeamSlackIntegration = async (
  id: string,
  installation: Installation
) => {
  try {
    const team = await getTeamById(id);
    if (!team) return false;
    team.integrations.push({ data: installation, type: "Slack" });
    const updateCommandInput: UpdateItemCommandInput = {
      TableName: TEAM_TABLE_NAME,
      ConditionExpression: "attribute_exists(pk)", // asserts that the user exists
      Key: {
        pk: { S: team.pk },
        sk: { S: team.sk },
      },
      ExpressionAttributeValues: {
        ":val": {
          L: team.integrations.map((m) => ({
            M: marshall(m, { removeUndefinedValues: true }),
          })),
        },
      },
      UpdateExpression: "SET integrations = :val",
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
    return false;
  }
};

export const updateTeamSlackInstallation = async (
  oldInstallation: SlackInstallation,
  newInstallation: SlackInstallation,
  team: Team
) => {
  try {
    const currentIntegrations = team.integrations;
    const updatedIntegrations = currentIntegrations.map((i) => {
      if (i.type === "Slack") {
        if (
          i.data.team?.id === oldInstallation.team?.id &&
          i.data.incomingWebhook?.channelId ===
            oldInstallation.incomingWebhook?.channelId
        ) {
          i.data = newInstallation;
        }
        return i;
      }
      return i;
    });
    const marshalledInstallations = updatedIntegrations.map((installation) => ({
      M: marshall(installation, { removeUndefinedValues: true }),
    }));
    const updateCommandInput: UpdateItemCommandInput = {
      TableName: TEAM_TABLE_NAME,
      ConditionExpression: "attribute_exists(pk)", // asserts that the user exists
      Key: {
        pk: { S: team.pk },
        sk: { S: team.sk },
      },
      ExpressionAttributeValues: {
        ":val": {
          L: marshalledInstallations,
        },
      },
      UpdateExpression: "SET integrations = :val",
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

export const deleteTeamSlackInstallation = async ({
  team,
  slackChannel,
  slackTeam,
}: {
  team: Team;
  slackTeam: string;
  slackChannel: string;
}) => {
  try {
    const currentIntegrations = team.integrations;
    const updatedIntegrations = currentIntegrations.filter((i) => {
      if (i.type === "Slack") {
        return !(
          i.data.team?.id === slackTeam &&
          i.data.incomingWebhook?.channelId === slackChannel
        );
      }
      return true;
    });
    const marshalledInstallations = updatedIntegrations.map((installation) => ({
      M: marshall(installation, { removeUndefinedValues: true }),
    }));
    const updateCommandInput: UpdateItemCommandInput = {
      TableName: TEAM_TABLE_NAME,
      ConditionExpression: "attribute_exists(pk)", // asserts that the user exists
      Key: {
        pk: { S: team.pk },
        sk: { S: team.sk },
      },
      ExpressionAttributeValues: {
        ":val": {
          L: marshalledInstallations,
        },
      },
      UpdateExpression: "SET integrations = :val",
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
