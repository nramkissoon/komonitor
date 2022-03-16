import type { DynamoDBDocument } from "@aws-sdk/lib-dynamodb";
import { randomBytes } from "crypto";
import { Account } from "next-auth";
import {
  Adapter,
  AdapterSession,
  AdapterUser,
  VerificationToken,
} from "next-auth/adapters";
import { env } from "../../common/server-utils";

const isoDateRE =
  /(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d\.\d+([+-][0-2]\d:[0-5]\d|Z))|(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d([+-][0-2]\d:[0-5]\d|Z))|(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d([+-][0-2]\d:[0-5]\d|Z))/;
function isDate(value: any) {
  return value && isoDateRE.test(value) && !isNaN(Date.parse(value));
}

export const format = {
  /** Takes a plain old JavaScript object and turns it into a Dynamodb object */
  to(object: Record<string, any>) {
    const newObject: Record<string, unknown> = {};
    for (const key in object) {
      const value = object[key];
      if (value instanceof Date) {
        // DynamoDB requires the TTL attribute be a UNIX timestamp (in secs).
        if (key === "expires") newObject[key] = value.getTime() / 1000;
        else newObject[key] = value.toISOString();
      } else newObject[key] = value;
    }
    return newObject;
  },
  /** Takes a Dynamo object and returns a plain old JavaScript object */
  from<T = Record<string, unknown>>(
    object: Record<string, any> | undefined,
    keys: string[] = ["pk", "sk", "GSI1PK", "GSI1SK"]
  ): T | null {
    if (!object) return null;
    const newObject: Record<string, unknown> = {};
    for (const key in object) {
      // Filter DynamoDB table and GSI keys so it doesn't get passed to core,
      // to avoid revealing the type of database
      if (keys.includes(key)) continue;

      const value = object[key];

      if (isDate(value)) newObject[key] = new Date(value);
      // hack to keep type property in account
      else if (key === "type" && ["SESSION", "VT", "USER"].includes(value))
        continue;
      // The expires property is stored as a UNIX timestamp in seconds, but
      // JavaScript needs it in milliseconds, so multiply by 1000.
      else if (key === "expires" && typeof value === "number")
        newObject[key] = new Date(value * 1000);
      else newObject[key] = value;
    }
    return newObject as T;
  },
};

export function generateUpdateExpression(object: Record<string, any>): {
  UpdateExpression: string;
  ExpressionAttributeNames: Record<string, string>;
  ExpressionAttributeValues: Record<string, unknown>;
} {
  const formatedSession = format.to(object);
  let UpdateExpression = "set";
  const ExpressionAttributeNames: Record<string, string> = {};
  const ExpressionAttributeValues: Record<string, unknown> = {};
  for (const property in formatedSession) {
    UpdateExpression += ` #${property} = :${property},`;
    ExpressionAttributeNames["#" + property] = property;
    ExpressionAttributeValues[":" + property] = formatedSession[property];
  }
  UpdateExpression = UpdateExpression.slice(0, -1);
  return {
    UpdateExpression,
    ExpressionAttributeNames,
    ExpressionAttributeValues,
  };
}

export interface DynamoDBAdapterOptions {
  /**
   * The name of the DynamoDB table.
   *
   * @default next-auth
   */
  tableName?: string;

  /**
   * The name of the global secondary index (GSI).
   *
   * @default GSI1
   */
  indexName?: string;

  /**
   * The partition key of the DynamoDB table.
   *
   * @default pk
   */
  partitionKey?: string;

  /**
   * The sort key of the DynamoDB table.
   *
   * @default sk
   */
  sortKey?: string;

  /**
   * The partition key of the global secondary index (GSI).
   *
   * @default GSI1PK
   */
  indexPartitionKey?: string;

  /**
   * The sort key of the global secondary index (GSI).
   *
   * @default GSI1SK
   */
  indexSortKey?: string;
}

// Custom DynamoDB Adapter
export const DynamoDBAdapter = (
  client: DynamoDBDocument,
  options: DynamoDBAdapterOptions
): Adapter => {
  const TableName = options?.tableName ?? "next-auth";
  const IndexName = options?.indexName ?? "GSI1";

  const partitionKey = options?.partitionKey ?? "pk";
  const sortKey = options?.sortKey ?? "sk";
  const indexPartitionKey = options?.indexPartitionKey ?? "GSI1PK";
  const indexSortKey = options?.indexSortKey ?? "GSI1SK";
  const keys = [partitionKey, sortKey, indexPartitionKey, indexSortKey];

  return {
    async createUser(profile) {
      let userId = profile.id ?? randomBytes(16).toString("hex");
      const now = new Date();
      const item: any = {
        pk: `USER#${userId}`,
        sk: `USER#${userId}`,
        id: userId,
        type: "USER",
        name: profile.name,
        email: profile.email,
        image: profile.image,
        username: profile.username,
        emailVerified: (profile as any).emailVerified?.toISOString() ?? null,
        emailOptIn: false,
        createdAt: now.toISOString(),
        updatedAt: now.toISOString(),
        refresh_token_expires_in: profile.refresh_token_expires_in ?? undefined,
        integrations: [],
      };

      if (profile.email) {
        item.GSI1SK = `USER#${profile.email}`;
        item.GSI1PK = `USER#${profile.email}`;
      }

      await client.put({ TableName, Item: item });
      try {
        await fetch(env.SLACK_NEW_USER_NOTIFICATION_BOT_WEBHOOK, {
          method: "POST",
          headers: new Headers({ "content-type": "application/json" }),
          body: JSON.stringify({
            text: "[NEW USER] - " + process.env.NODE_ENV,
            attachments: [
              {
                color: "#E53E3E",
                blocks: [
                  {
                    type: "section",
                    text: {
                      type: "mrkdwn",
                      text: `Email: *${profile.email}*\nName: *${profile.name}*`,
                    },
                  },
                ],
              },
            ],
          }),
        });
      } catch (err) {
        // pass
      }
      return item;
    },
    async getUser(id) {
      const data = await client.get({
        TableName,
        Key: {
          pk: `USER#${id}`,
          sk: `USER#${id}`,
        },
      });

      return format.from<AdapterUser>(data.Item, keys);
    },
    async getUserByEmail(email) {
      const data = await client.query({
        TableName,
        IndexName: "GSI1",
        KeyConditionExpression: "#gsi1pk = :gsi1pk AND #gsi1sk = :gsi1sk",
        ExpressionAttributeNames: {
          "#gsi1pk": "GSI1PK",
          "#gsi1sk": "GSI1SK",
        },
        ExpressionAttributeValues: {
          ":gsi1pk": `USER#${email ?? ""}`,
          ":gsi1sk": `USER#${email ?? ""}`,
        },
      });

      return format.from<AdapterUser>(data.Items?.[0], keys);
    },
    async getUserByAccount({ provider, providerAccountId }) {
      const data = await client.query({
        TableName,
        IndexName: "GSI1",
        KeyConditionExpression: "#gsi1pk = :gsi1pk AND #gsi1sk = :gsi1sk",
        ExpressionAttributeNames: {
          "#gsi1pk": "GSI1PK",
          "#gsi1sk": "GSI1SK",
        },
        ExpressionAttributeValues: {
          ":gsi1pk": `ACCOUNT#${provider}`,
          ":gsi1sk": `ACCOUNT#${providerAccountId}`,
        },
      });

      if (!data.Items?.length) return null;

      const accounts = data.Items[0] as Account;
      const res = await client.get({
        TableName,
        Key: {
          [partitionKey]: `USER#${accounts.userId}`,
          [sortKey]: `USER#${accounts.userId}`,
        },
      });

      return format.from<AdapterUser>(res.Item, keys);
    },
    async updateUser(user) {
      const {
        UpdateExpression,
        ExpressionAttributeNames,
        ExpressionAttributeValues,
      } = generateUpdateExpression(user);
      const data = await client.update({
        TableName,
        Key: {
          // next-auth type is incorrect it should be Partial<AdapterUser> & {id: string} instead of just Partial<AdapterUser>
          [partitionKey]: `USER#${user.id as string}`,
          [sortKey]: `USER#${user.id as string}`,
        },
        UpdateExpression,
        ExpressionAttributeNames,
        ExpressionAttributeValues,
        ReturnValues: "ALL_NEW",
      });

      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      return format.from<AdapterUser>(data.Attributes, keys)!;
    },
    async deleteUser(userId) {
      // query all the items related to the user to delete
      const res = await client.query({
        TableName,
        KeyConditionExpression: "#pk = :pk",
        ExpressionAttributeNames: { "#pk": partitionKey },
        ExpressionAttributeValues: { ":pk": `USER#${userId}` },
      });

      if (!res.Items) return null;
      const items = res.Items;
      // find the user we want to delete to return at the end of the function call
      const user = items.find((item) => item.type === "USER");
      const itemsToDelete = items.map((item) => {
        return {
          DeleteRequest: {
            Key: {
              [sortKey]: item[sortKey],
              [partitionKey]: item[partitionKey],
            },
          },
        };
      });
      // batch write commands cannot handle more than 25 requests at once
      const itemsToDeleteMax = itemsToDelete.slice(0, 25);
      const param = {
        RequestItems: { [TableName]: itemsToDeleteMax },
      };
      await client.batchWrite(param);
      return format.from<AdapterUser>(user, keys);
    },
    async linkAccount(data) {
      const item = {
        ...data,
        id: randomBytes(16).toString("hex"),
        [partitionKey]: `USER#${data.userId}`,
        [sortKey]: `ACCOUNT#${data.provider}#${data.providerAccountId}`,
        [indexPartitionKey]: `ACCOUNT#${data.provider}`,
        [indexSortKey]: `ACCOUNT#${data.providerAccountId}`,
      };
      await client.put({ TableName, Item: format.to(item) });
      return data;
    },
    async unlinkAccount({ provider, providerAccountId }) {
      const data = await client.query({
        TableName,
        IndexName,
        KeyConditionExpression: "#gsi1pk = :gsi1pk AND #gsi1sk = :gsi1sk",
        ExpressionAttributeNames: {
          "#gsi1pk": indexPartitionKey,
          "#gsi1sk": indexSortKey,
        },
        ExpressionAttributeValues: {
          ":gsi1pk": `ACCOUNT#${provider}`,
          ":gsi1sk": `ACCOUNT#${providerAccountId}`,
        },
      });

      const account = format.from<Account>(data.Items?.[0], keys);
      if (!account) return;
      await client.delete({
        TableName,
        Key: {
          [partitionKey]: `USER#${account.userId}`,
          [sortKey]: `ACCOUNT#${provider}#${providerAccountId}`,
        },
        ReturnValues: "ALL_OLD",
      });
      return account;
    },
    async createSession(data) {
      const session = {
        id: randomBytes(16).toString("hex"),
        ...data,
      };
      await client.put({
        TableName,
        Item: format.to({
          [partitionKey]: `USER#${data.userId}`,
          [sortKey]: `SESSION#${data.sessionToken}`,
          [indexSortKey]: `SESSION#${data.sessionToken}`,
          [indexPartitionKey]: `SESSION#${data.sessionToken}`,
          type: "SESSION",
          ...data,
        }),
      });
      return session;
    },
    async getSessionAndUser(sessionToken) {
      const data = await client.query({
        TableName,
        IndexName,
        KeyConditionExpression: "#gsi1pk = :gsi1pk AND #gsi1sk = :gsi1sk",
        ExpressionAttributeNames: {
          "#gsi1pk": indexPartitionKey,
          "#gsi1sk": indexSortKey,
        },
        ExpressionAttributeValues: {
          ":gsi1pk": `SESSION#${sessionToken}`,
          ":gsi1sk": `SESSION#${sessionToken}`,
        },
      });

      const session = format.from<AdapterSession>(data.Items?.[0], keys);
      if (!session) return null;
      const res = await client.get({
        TableName,
        Key: {
          [partitionKey]: `USER#${session.userId}`,
          [sortKey]: `USER#${session.userId}`,
        },
      });

      const user = format.from<AdapterUser>(res.Item, keys);
      if (!user) return null;
      return { user, session };
    },
    async updateSession(session) {
      const { sessionToken } = session;
      const data = await client.query({
        TableName,
        IndexName,
        KeyConditionExpression: "#gsi1pk = :gsi1pk AND #gsi1sk = :gsi1sk",
        ExpressionAttributeNames: {
          "#gsi1pk": indexPartitionKey,
          "#gsi1sk": indexSortKey,
        },
        ExpressionAttributeValues: {
          ":gsi1pk": `SESSION#${sessionToken}`,
          ":gsi1sk": `SESSION#${sessionToken}`,
        },
      });
      if (!data.Items?.length) return null;
      const item = data.Items[0] as any;

      const {
        UpdateExpression,
        ExpressionAttributeNames,
        ExpressionAttributeValues,
      } = generateUpdateExpression(session);
      const res = await client.update({
        TableName,
        Key: { [partitionKey]: item[partitionKey], [sortKey]: item[sortKey] },
        UpdateExpression,
        ExpressionAttributeNames,
        ExpressionAttributeValues,
        ReturnValues: "ALL_NEW",
      });
      return format.from<AdapterSession>(res.Attributes, keys);
    },
    async deleteSession(sessionToken) {
      const data = await client.query({
        TableName,
        IndexName,
        KeyConditionExpression: "#gsi1pk = :gsi1pk AND #gsi1sk = :gsi1sk",
        ExpressionAttributeNames: {
          "#gsi1pk": indexPartitionKey,
          "#gsi1sk": indexSortKey,
        },
        ExpressionAttributeValues: {
          ":gsi1pk": `SESSION#${sessionToken}`,
          ":gsi1sk": `SESSION#${sessionToken}`,
        },
      });
      if (!data?.Items?.length) return null;

      const item = data.Items[0] as any;

      const res = await client.delete({
        TableName,
        Key: { [partitionKey]: item[partitionKey], [sortKey]: item[sortKey] },
        ReturnValues: "ALL_OLD",
      });
      return format.from<AdapterSession>(res.Attributes, keys);
    },
    async createVerificationToken(data) {
      await client.put({
        TableName,
        Item: format.to({
          [partitionKey]: `VT#${data.identifier}`,
          [sortKey]: `VT#${data.token}`,
          type: "VT",
          ...data,
        }),
      });
      return data;
    },
    async useVerificationToken({ identifier, token }) {
      const data = await client.delete({
        TableName,
        Key: {
          [partitionKey]: `VT#${identifier}`,
          [sortKey]: `VT#${token}`,
        },
        ReturnValues: "ALL_OLD",
      });
      return format.from<VerificationToken>(data.Attributes, keys);
    },
  };
};
