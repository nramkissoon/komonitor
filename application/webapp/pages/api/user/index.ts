import { NextApiRequest, NextApiResponse } from "next";
import { Session } from "next-auth";
import { getSession } from "next-auth/client";
import { ddbClient, env } from "../../../src/common/server-utils";
import { PLAN_PRODUCT_IDS } from "../../../src/modules/billing/plans";
import {
  deleteUserById,
  getServicePlanProductIdForUser,
} from "../../../src/modules/user/user-db";

async function deleteHandler(
  req: NextApiRequest,
  res: NextApiResponse,
  session: Session
) {
  try {
    const userId = session.uid as string;
    const productId = await getServicePlanProductIdForUser(
      ddbClient,
      env.USER_TABLE_NAME,
      userId
    );
    // Cannot delete if user is on a paid plan
    if (productId !== PLAN_PRODUCT_IDS.FREE) {
      res.status(403);
      return;
    }

    const deleted = await deleteUserById(
      ddbClient,
      env.USER_TABLE_NAME,
      userId
    );
    if (deleted) {
      res.status(200);
      return;
    } else {
      throw new Error("Failed to delete user from DB");
    }
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
