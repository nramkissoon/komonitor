import {
  DeleteItemCommand,
  DeleteItemCommandInput,
  DynamoDBClient,
  QueryCommand,
  QueryCommandInput,
  UpdateItemCommand,
  UpdateItemCommandInput,
} from "@aws-sdk/client-dynamodb";
import { unmarshall } from "@aws-sdk/util-dynamodb";
import { User } from "project-types";
import Stripe from "stripe";
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
    return PLAN_PRODUCT_IDS.FREE;
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
      user.product_id !== PLAN_PRODUCT_IDS.FREE &&
      user.current_period_end
    ) {
      const now = Date.now();
      return {
        valid: user.current_period_end >= now,
        productId: user.product_id,
      };
    }
    return { valid: true, productId: PLAN_PRODUCT_IDS.FREE };
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
        ":p": { S: PLAN_PRODUCT_IDS.FREE },
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
