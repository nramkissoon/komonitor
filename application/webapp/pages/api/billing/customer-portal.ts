import { NextApiRequest, NextApiResponse } from "next";
import { Session } from "next-auth";
import { getSession } from "next-auth/client";
import { ddbClient, env, stripeClient } from "../../../src/common/server-utils";
import { PLAN_PRODUCT_IDS } from "../../../src/modules/billing/plans";
import {
  getOrCreateStripeCustomerIdForUserId,
  getServicePlanProductIdForUser,
} from "../../../src/modules/user/user-db";

async function postHandler(
  req: NextApiRequest,
  res: NextApiResponse,
  session: Session
) {
  try {
    const userId = session.uid as string;
    const stripeCustomerId: string | undefined =
      await getOrCreateStripeCustomerIdForUserId(
        ddbClient,
        env.USER_TABLE_NAME,
        userId
      );

    const productId = await getServicePlanProductIdForUser(
      ddbClient,
      env.USER_TABLE_NAME,
      userId
    );

    //redirect to pricing page if free plan
    if (productId === PLAN_PRODUCT_IDS.FREE) {
      res.status(200);
      res.json({ url: env.BASE_URL + "pricing" });
      return;
    }

    if (stripeCustomerId === undefined)
      throw new Error("undefined Stripe Customer Id");

    const portSession = await stripeClient.billingPortal.sessions.create({
      customer: stripeCustomerId,
      return_url: env.BASE_URL + "app/settings?tab=1",
    });

    res.json({ url: portSession.url as string });
  } catch (err) {
    console.log(err);
    res.status(500);
    return;
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
        await postHandler(req, res, session);
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
