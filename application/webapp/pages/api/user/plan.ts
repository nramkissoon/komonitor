import { NextApiRequest, NextApiResponse } from "next";
import { Session } from "next-auth";
import { getSession } from "next-auth/react";
import { ddbClient, env } from "../../../src/common/server-utils";
import { getServicePlanProductIdForUser } from "../../../src/modules/user/user-db";

async function getHandler(
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
    const response = { productId: productId };
    res.status(200);
    res.json(response);
  } catch (err) {
    // User is allowed to be unauthed in the pricing page
    if (req.headers.referer === env.SERVER_HOSTNAME + "pricing") {
      res.status(200);
      res.json({});
      return;
    }
    res.status(500);
    return;
  }
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = (await getSession({ req })) as Session;
  switch (req.method) {
    case "GET":
      await getHandler(req, res, session);
      break;
    default:
      res.status(405);
      break;
  }

  res.end();
}
