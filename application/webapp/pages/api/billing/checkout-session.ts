import { NextApiRequest, NextApiResponse } from "next";
import { Session } from "next-auth";
import { getSession } from "next-auth/client";
import { ddbClient, env, stripeClient } from "../../../src/common/server-utils";
import { getOrCreateStripeCustomerIdForUserId } from "../../../src/modules/user/user-db";

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

    if (stripeCustomerId === undefined)
      throw new Error("undefined Stripe Customer Id");

    const priceId = JSON.parse(req.body);

    const validPrice = await stripeClient.prices.retrieve(priceId);

    if (!validPrice.active) {
      res.status(400);
      return;
    }

    const stripeSession = await stripeClient.checkout.sessions.create({
      billing_address_collection: "auto",
      payment_method_types: ["card"],
      line_items: [
        {
          price: validPrice.id,
          quantity: 1,
        },
      ],
      mode: "subscription",
      success_url:
        env.BASE_URL + "/app?upgraded=true&session_id={CHECKOUT_SESSION_ID}",
      cancel_url: env.BASE_URL + "/pricing?checkout_canceled=true",
      customer: stripeCustomerId,
      client_reference_id: userId,
    });

    res.json({ url: stripeSession.url as string });
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
