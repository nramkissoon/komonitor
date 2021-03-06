import {
  DeleteItemCommand,
  DeleteItemCommandInput,
  DynamoDBClient,
  QueryCommand,
  QueryCommandInput,
  UpdateItemCommand,
  UpdateItemCommandInput,
} from "@aws-sdk/client-dynamodb";
import { marshall, unmarshall } from "@aws-sdk/util-dynamodb";
import Stripe from "stripe";
import {
  DiscordWebhookIntegration,
  SlackInstallation,
  User,
  UserIntegration,
  WebhookSecret,
} from "utils";
import { ddbClient, env } from "../../common/server-utils";
import { createStripeCustomer, getStripeCustomer } from "../billing/customer";
import { PLAN_PRODUCT_IDS } from "../billing/plans";

export async function getUserById(
  ddbClient: DynamoDBClient,
  userTableName: string,
  id: string
): Promise<User | undefined> {
  try {
    const queryCommandInput: QueryCommandInput = {
      TableName: userTableName,
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

export async function deleteUserById(
  ddbClient: DynamoDBClient,
  userTableName: string,
  id: string
) {
  try {
    const deleteItemCommandInput: DeleteItemCommandInput = {
      TableName: userTableName,
      Key: { pk: { S: "USER#" + id }, sk: { S: "USER#" + id } },
    };
    const response = await ddbClient.send(
      new DeleteItemCommand(deleteItemCommandInput)
    );
    const statusCode = response.$metadata.httpStatusCode as number;
    if (statusCode >= 200 && statusCode < 300) return true;
    return false;
  } catch (err) {
    return false;
  }
}

export async function updateUserIfExists(
  ddbClient: DynamoDBClient,
  userTableName: string,
  userId: string,
  updateItemCommandInput: UpdateItemCommandInput
): Promise<boolean> {
  try {
    const exists =
      (await getUserById(ddbClient, userTableName, userId)) !== undefined;
    if (exists) {
      const response = await ddbClient.send(
        new UpdateItemCommand(updateItemCommandInput)
      );
      const statusCode = response.$metadata.httpStatusCode as number;
      return statusCode >= 200 && statusCode < 300;
    }
    return false;
  } catch (err) {
    return false;
  }
}

export async function getTimezonePreferenceForUser(
  ddbClient: DynamoDBClient,
  userTableName: string,
  userId: string
): Promise<string> {
  try {
    const user = await getUserById(ddbClient, userTableName, userId);
    if (!user) {
      throw new Error("undefined user: " + user + ", id: " + userId);
    }
    if (user.tz) return user.tz;
    return "Etc/GMT";
  } catch (err) {
    console.log(err);
    return "Etc/GMT";
  }
}

export async function setTimezonePreferenceForUser(
  ddbClient: DynamoDBClient,
  userTableName: string,
  userId: string,
  timezone: string
) {
  try {
    const updateCommandInput: UpdateItemCommandInput = {
      TableName: userTableName,
      ConditionExpression: "attribute_exists(pk)", // asserts that the user exists
      Key: {
        pk: { S: "USER#" + userId },
        sk: { S: "USER#" + userId },
      },
      ExpressionAttributeValues: {
        ":p": { S: timezone },
      },
      UpdateExpression: "SET tz = :p",
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
}

export async function setUserWebhookSecret(
  userId: string,
  secret: WebhookSecret
) {
  try {
    const updateCommandInput: UpdateItemCommandInput = {
      TableName: env.USER_TABLE_NAME,
      ConditionExpression: "attribute_exists(pk)", // asserts that the user exists
      Key: {
        pk: { S: "USER#" + userId },
        sk: { S: "USER#" + userId },
      },
      ExpressionAttributeValues: {
        ":p": { M: marshall(secret) },
      },
      UpdateExpression: "SET webhook_secret = :p",
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
}

export async function deleteUserWebhook(userId: string) {
  try {
    const updateCommandInput: UpdateItemCommandInput = {
      TableName: env.USER_TABLE_NAME,
      ConditionExpression: "attribute_exists(pk)", // asserts that the user exists
      Key: {
        pk: { S: "USER#" + userId },
        sk: { S: "USER#" + userId },
      },
      UpdateExpression: "REMOVE webhook_secret",
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
}

export async function setEmailOptInForUser(
  ddbClient: DynamoDBClient,
  userTableName: string,
  userId: string,
  optIn: boolean
) {
  try {
    const updateCommandInput: UpdateItemCommandInput = {
      TableName: userTableName,
      ConditionExpression: "attribute_exists(pk)", // asserts that the user exists
      Key: {
        pk: { S: "USER#" + userId },
        sk: { S: "USER#" + userId },
      },
      ExpressionAttributeValues: {
        ":p": { BOOL: optIn },
      },
      UpdateExpression: "SET emailOptIn = :p",
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
}

export async function getServicePlanProductIdForUser(
  ddbClient: DynamoDBClient,
  userTableName: string,
  userId: string
): Promise<string> {
  try {
    const user = await getUserById(ddbClient, userTableName, userId);
    if (!user) {
      throw new Error("undefined user");
    }
    if (user.product_id && user.product_id !== null) return user.product_id;
    return PLAN_PRODUCT_IDS.STARTER;
  } catch (err) {
    throw err;
  }
}

export async function getUserSubscriptionIsValid(
  ddbClient: DynamoDBClient,
  userTableName: string,
  userId: string
) {
  try {
    const user = await getUserById(ddbClient, userTableName, userId);
    if (!user) {
      throw new Error("undefined user");
    }
    if (
      user.product_id &&
      user.product_id !== null &&
      user.product_id !== PLAN_PRODUCT_IDS.STARTER &&
      user.current_period_end
    ) {
      const now = Date.now();
      return {
        valid: user.current_period_end >= now,
        productId: user.product_id,
      };
    }
    return { valid: true, productId: PLAN_PRODUCT_IDS.STARTER };
  } catch (err) {
    throw err;
  }
}

export async function setServicePlanProductIdForUser(
  ddbClient: DynamoDBClient,
  userTableName: string,
  userId: string,
  servicePlanProductId: string
) {
  try {
    const updateCommandInput: UpdateItemCommandInput = {
      TableName: userTableName,
      ConditionExpression: "attribute_exists(pk)", // asserts that the user exists
      Key: {
        pk: { S: "USER#" + userId },
        sk: { S: "USER#" + userId },
      },
      ExpressionAttributeValues: {
        ":p": { S: servicePlanProductId },
      },
      UpdateExpression: "SET product_id = :p",
    };

    const response = await ddbClient.send(
      new UpdateItemCommand(updateCommandInput)
    );
    const statusCode = response.$metadata.httpStatusCode as number;
    if (statusCode >= 200 && statusCode < 300) return true;

    // throw an error with the requestId for debugging
    throw new Error(response.$metadata.requestId);
  } catch (err) {
    // TODO log
    throw err;
  }
}

export async function setStripeCustomerIdForUser(
  ddbClient: DynamoDBClient,
  userTableName: string,
  userId: string,
  customerId: string
) {
  try {
    const updateCommandInput: UpdateItemCommandInput = {
      TableName: userTableName,
      ConditionExpression: "attribute_exists(pk)", // asserts that the user exists
      Key: {
        pk: { S: "USER#" + userId },
        sk: { S: "USER#" + userId },
      },
      ExpressionAttributeValues: {
        ":p": { S: customerId },
      },
      UpdateExpression: "SET customer_id = :p",
    };

    const response = await ddbClient.send(
      new UpdateItemCommand(updateCommandInput)
    );
    const statusCode = response.$metadata.httpStatusCode as number;
    if (statusCode >= 200 && statusCode < 300) return true;

    // throw an error with the requestId for debugging
    throw new Error(response.$metadata.requestId);
  } catch (err) {
    // TODO log
    throw err;
  }
}

export async function getOrCreateStripeCustomerIdForUserId(
  ddbClient: DynamoDBClient,
  userTableName: string,
  userId: string
) {
  try {
    const user = await getUserById(ddbClient, userTableName, userId);
    if (user === undefined) throw new Error("user undefined");

    // Check if already has customer id
    const hasStripeCustomerId = user.customer_id !== undefined;
    if (hasStripeCustomerId) return user.customer_id;

    // create new Stripe customer
    const stripeCustomer = await createStripeCustomer(
      userId,
      user.email as string,
      user.name ?? undefined
    );

    // only return id if we have updated the user in DB
    const updated = await setStripeCustomerIdForUser(
      ddbClient,
      userTableName,
      userId,
      stripeCustomer.id
    );
    if (updated) return stripeCustomer.id;

    throw new Error("Failed to updated customer with Stripe customer ID");
  } catch (err) {
    console.log(err);
    throw err;
  }
}

export async function downgradeUserToFreePlan(
  ddbClient: DynamoDBClient,
  userTableName: string,
  userId: string
) {
  try {
    const updateCommandInput: UpdateItemCommandInput = {
      TableName: userTableName,
      ConditionExpression: "attribute_exists(pk)", // asserts that the user exists
      Key: {
        pk: { S: "USER#" + userId },
        sk: { S: "USER#" + userId },
      },
      ExpressionAttributeValues: {
        ":p": { S: PLAN_PRODUCT_IDS.STARTER },
      },
      UpdateExpression:
        "SET product_id = :p REMOVE subscription_status, current_period_end, subscription_id",
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
}

// "provision" is the same as update
export async function provisionSubscriptionProductForUser(
  ddbClient: DynamoDBClient,
  userTableName: string,
  userId: string,
  subscriptionId: string,
  subscriptionStatus: string,
  currentPeriodEnd: number,
  productId: string
) {
  try {
    const updateCommandInput: UpdateItemCommandInput = {
      TableName: userTableName,
      ConditionExpression: "attribute_exists(pk)", // asserts that the user exists
      Key: {
        pk: { S: "USER#" + userId },
        sk: { S: "USER#" + userId },
      },
      ExpressionAttributeValues: {
        ":p": { S: productId },
        ":i": { S: subscriptionId },
        ":s": { S: subscriptionStatus },
        ":c": { N: currentPeriodEnd.toString() },
      },
      UpdateExpression:
        "SET product_id=:p, subscription_id=:i, current_period_end=:c, subscription_status=:s ",
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
}

export async function getUserFromStripeCustomerId(
  ddbClient: DynamoDBClient,
  userTableName: string,
  customerId: string
) {
  try {
    const user = await getUserById(
      ddbClient,
      userTableName,
      ((await getStripeCustomer(customerId)) as Stripe.Customer).metadata[
        "user_id"
      ]
    );

    if (user !== undefined) return user;
    else {
      throw new Error("undefined user");
    }
  } catch (err) {
    console.error(err);
    throw err;
  }
}

export async function getUserSlackInstallations(
  ddbClient: DynamoDBClient,
  userTableName: string,
  userId: string
) {
  try {
    const user = await getUserById(ddbClient, userTableName, userId);
    if (!user) {
      throw new Error("undefined user");
    }

    const installations = user.slack_installations ?? [];

    if (installations.length === 0) return [];
    return installations;
  } catch (err) {
    console.error(err);
    throw err;
  }
}

export async function deleteUserSlackInstallation(
  ddbClient: DynamoDBClient,
  userTableName: string,
  userId: string,
  teamId: string,
  channelId: string
) {
  try {
    const currentInstallations = await getUserSlackInstallations(
      ddbClient,
      userTableName,
      userId
    );

    const updatedInstallations = currentInstallations.filter(
      (i) =>
        !(i.team?.id === teamId && i.incomingWebhook?.channelId === channelId)
    );

    const marshalledInstallations = updatedInstallations.map(
      (installation) => ({
        M: marshall(installation, { removeUndefinedValues: true }),
      })
    );

    const updateCommandInput: UpdateItemCommandInput = {
      TableName: userTableName,
      ConditionExpression: "attribute_exists(pk)", // asserts that the user exists
      Key: {
        pk: { S: "USER#" + userId },
        sk: { S: "USER#" + userId },
      },
      ExpressionAttributeValues: {
        ":i": {
          L: marshalledInstallations,
        },
      },
      UpdateExpression: "SET slack_installations = :i",
    };

    const response = await ddbClient.send(
      new UpdateItemCommand(updateCommandInput)
    );
    const statusCode = response.$metadata.httpStatusCode as number;
    if (statusCode >= 200 && statusCode < 300) return true;

    // throw an error with the requestId for debugging
    throw new Error(response.$metadata.requestId);
  } catch (err) {
    // TODO log
    throw err;
  }
}

export const deleteUserDiscordIntegration = async ({
  user,
  channelId,
  guildId,
}: {
  user: User;
  channelId: string;
  guildId: string;
}) => {
  try {
    const currentIntegrations = user.integrations;
    const updatedIntegrations = currentIntegrations
      ? currentIntegrations.filter((i) => {
          if (i.type === "DiscordWebhook") {
            return !(
              (i.data as DiscordWebhookIntegration).webhook.guild_id ===
                guildId &&
              (i.data as DiscordWebhookIntegration).webhook.channel_id ===
                channelId
            );
          }
          return true;
        })
      : [];
    const marshalledInstallations = updatedIntegrations.map((installation) => ({
      M: marshall(installation, { removeUndefinedValues: true }),
    }));
    const updateCommandInput: UpdateItemCommandInput = {
      TableName: env.USER_TABLE_NAME,
      ConditionExpression: "attribute_exists(pk)", // asserts that the user exists
      Key: {
        pk: { S: "USER#" + user.id },
        sk: { S: "USER#" + user.id },
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

export const addUserIntegration = async (
  user: User,
  integration: UserIntegration
) => {
  try {
    if (!user) return false;
    if (!user.integrations) {
      user.integrations = [integration];
    } else {
      user.integrations.push(integration);
    }
    const updateCommandInput: UpdateItemCommandInput = {
      TableName: env.USER_TABLE_NAME,
      ConditionExpression: "attribute_exists(pk)", // asserts that the user exists
      Key: {
        pk: { S: "USER#" + user.id },
        sk: { S: "USER#" + user.id },
      },
      ExpressionAttributeValues: {
        ":val": {
          L: user.integrations.map((m) => ({
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

export async function addUserSlackInstallation(
  ddbClient: DynamoDBClient,
  userTableName: string,
  userId: string,
  installation: SlackInstallation
) {
  try {
    const updateCommandInput: UpdateItemCommandInput = {
      TableName: userTableName,
      ConditionExpression: "attribute_exists(pk)", // asserts that the user exists
      Key: {
        pk: { S: "USER#" + userId },
        sk: { S: "USER#" + userId },
      },
      ExpressionAttributeValues: {
        ":i": {
          L: [{ M: marshall(installation, { removeUndefinedValues: true }) }],
        },
      },
      UpdateExpression:
        "SET slack_installations = list_append(slack_installations, :i)",
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
}

export async function updateUserSlackInstallation(
  ddbClient: DynamoDBClient,
  userTableName: string,
  userId: string,
  oldInstallation: SlackInstallation,
  installation: SlackInstallation
) {
  try {
    const currentInstallations = await getUserSlackInstallations(
      ddbClient,
      userTableName,
      userId
    );

    const updatedInstallations = currentInstallations.map((i) => {
      if (
        i.team?.id === oldInstallation.team?.id &&
        i.incomingWebhook?.channelId ===
          oldInstallation.incomingWebhook?.channelId
      ) {
        i = installation;
      }
      return i;
    });

    const marshalledInstallations = updatedInstallations.map(
      (installation) => ({
        M: marshall(installation, { removeUndefinedValues: true }),
      })
    );

    const updateCommandInput: UpdateItemCommandInput = {
      TableName: userTableName,
      ConditionExpression: "attribute_exists(pk)", // asserts that the user exists
      Key: {
        pk: { S: "USER#" + userId },
        sk: { S: "USER#" + userId },
      },
      ExpressionAttributeValues: {
        ":i": {
          L: marshalledInstallations,
        },
      },
      UpdateExpression: "SET slack_installations = :i",
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
}
