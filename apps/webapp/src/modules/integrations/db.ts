import {
  UpdateItemCommand,
  UpdateItemCommandInput,
} from "@aws-sdk/client-dynamodb";
import { marshall } from "@aws-sdk/util-dynamodb";
import { DiscordWebhookIntegration, Team, User } from "utils";
import { ddbClient, env } from "../../common/server-utils";

export const updateDiscordIntegration = async (
  oldInstallation: DiscordWebhookIntegration,
  newInstallation: DiscordWebhookIntegration,
  owner: User | Team
) => {
  try {
    const currentIntegrations = owner.integrations ?? [];
    const updatedIntegrations = currentIntegrations.map((i) => {
      if (i.type === "DiscordWebhook") {
        if (
          (i.data as DiscordWebhookIntegration).webhook.guild_id ===
            oldInstallation.webhook.guild_id &&
          (i.data as DiscordWebhookIntegration).webhook.channel_id ===
            oldInstallation.webhook.channel_id
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
      TableName: env.USER_TABLE_NAME,
      ConditionExpression: "attribute_exists(pk)", // asserts that the user exists
      Key: {
        pk: { S: owner.type === "TEAM" ? owner.id : "USER#" + owner.id },
        sk: { S: owner.type === "TEAM" ? owner.id : "USER#" + owner.id },
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
