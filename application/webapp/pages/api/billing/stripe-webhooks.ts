import { buffer } from "micro";
import Cors from "micro-cors";
import { NextApiRequest, NextApiResponse } from "next";
import { writeStripeEvent } from "../../../src/modules/billing/webhook-db";
import { handleEvent } from "../../../src/modules/billing/webhook-handlers/event-switch";
import {
  ddbClient,
  env,
  stripeClient,
} from "./../../../src/common/server-utils";

// Stripe requires the raw body to construct the event.
export const config = {
  api: {
    bodyParser: false,
  },
};

const cors = Cors({
  allowMethods: ["POST", "HEAD"],
});

async function postHandler(req: NextApiRequest, res: NextApiResponse) {
  let event;
  const endpointSecret = env.STRIPE_WEBHOOK_SECRET;

  if (endpointSecret) {
    const buf = await buffer(req);
    const signature = req.headers["stripe-signature"];

    try {
      event = stripeClient.webhooks.constructEvent(
        buf.toString(),
        signature as string | string[] | Buffer,
        endpointSecret
      );
    } catch (err) {
      console.error(
        `Webhook signature verification failed. Make sure webhooks are listened for locally.`,
        (err as Error).message
      );
      return res.status(400);
    }

    await writeStripeEvent(ddbClient, env.STRIPE_WEBHOOK_TABLE_NAME, event);

    // Handle the event
    await handleEvent(event);
    res.status(200);
    return;
  }
  res.status(500);
  return;
}

async function handler(req: NextApiRequest, res: NextApiResponse) {
  switch (req.method) {
    case "POST":
      await postHandler(req, res);
      break;
    default:
      res.status(405);
      break;
  }
  res.end();
}

export default cors(handler as any);
