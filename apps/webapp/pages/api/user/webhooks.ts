import crypto from "crypto";
import { NextApiRequest, NextApiResponse } from "next";
import { Session } from "next-auth";
import { getSession } from "next-auth/react";
import { WebhookSecret } from "utils";
import { ddbClient, env } from "../../../src/common/server-utils";
import {
  deleteUserWebhook,
  getUserById,
  setUserWebhookSecret,
} from "../../../src/modules/user/user-db";

async function createHandler(
  req: NextApiRequest,
  res: NextApiResponse,
  session: Session
) {
  try {
    const userId = session.uid as string;
    const chars =
      "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz".repeat(
        5
      );
    const rand = crypto.randomBytes(64);
    let token = "wh_";
    for (let i = 0; i < rand.length; i++) {
      let decimal = rand[i];
      token += chars[decimal];
    }
    const createdAt = new Date().getTime();

    const secret: WebhookSecret = {
      value: token,
      created_at: createdAt,
    };

    const user = getUserById(ddbClient, env.USER_TABLE_NAME, userId);

    if (!user) {
      res.status(401);
      return;
    }

    await setUserWebhookSecret(userId, secret);

    res.status(200);
    return;
  } catch (err) {
    console.error(err);
    res.status(500);
  }
}

async function deleteHandler(
  req: NextApiRequest,
  res: NextApiResponse,
  session: Session
) {
  try {
    const userId = session.uid as string;
    const user = getUserById(ddbClient, env.USER_TABLE_NAME, userId);

    if (!user) {
      res.status(401);
      return;
    }
    await deleteUserWebhook(userId);

    res.status(200);
    return;
  } catch (err) {
    console.error(err);
    res.status(500);
  }
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await getSession({ req });
  if (session) {
    switch (req.method) {
      case "POST":
        await createHandler(req, res, session);
        break;
      case "DELETE":
        await deleteHandler(req, res, session);
        break;
      default:
        res.status(405);
        break;
    }
  } else {
    res.status(401);
  }
  res.end();
}
