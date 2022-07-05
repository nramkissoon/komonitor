import { NextApiRequest, NextApiResponse } from "next";
import { Session } from "next-auth";
import { getSession } from "next-auth/react";
import { ddbClient, env } from "../../../src/common/server-utils";
import { getInvocationsForMultipleMonitors } from "../../../src/modules/alerts/invocations-db";
import { getServicePlanProductIdForUser } from "../../../src/modules/user/user-db";

async function getHandler(
  req: NextApiRequest,
  res: NextApiResponse,
  session: Session
) {
  try {
    const { id: ids, since } = req.query;
    // check if user can view statuses from the given time
    const userId = session.uid as string;
    const productId = await getServicePlanProductIdForUser(
      ddbClient,
      env.USER_TABLE_NAME,
      userId
    );
    // if (
    //   Number.parseInt(since as string) >
    //   getAlertInvocationHistoryAccessFromProductId(productId)
    // ) {
    //   res.status(403);
    //   return;
    // }

    const sinceAsNumber =
      new Date().getTime() - Number.parseInt(since as string);
    const idsAsList = typeof ids === "string" ? [ids] : ids;
    if (!since || !ids || !sinceAsNumber || !idsAsList) {
      res.status(400);
      return;
    }

    const invocations = await getInvocationsForMultipleMonitors(
      ddbClient,
      idsAsList,
      env.ALERT_INVOCATION_TABLE_NAME,
      sinceAsNumber
    );
    res.status(200);
    res.json(invocations);
  } catch (err) {
    console.log(err);
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
      case "GET":
        await getHandler(req, res, session);
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
