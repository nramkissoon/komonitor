import { NextApiRequest, NextApiResponse } from "next";
import { Stripe } from "stripe";
import { env, stripeClient } from "./../../../src/common/server-utils";

async function postHandler(req: NextApiRequest, res: NextApiResponse) {
  let event;

  const endpointSecret = env.STRIPE_WEBHOOK_SECRET;
  if (endpointSecret) {
    const signature = req.headers["stripe-signature"] as string;
    try {
      event = stripeClient.webhooks.constructEvent(
        req.body,
        signature,
        endpointSecret
      );
    } catch (err) {
      console.error(
        `⚠️  Webhook signature verification failed.`,
        (err as Error).message
      );
      return res.status(400);
    }

    // TODO write event to DB

    let subscription;
    let status;
    // Handle the event
    switch (event.type) {
      case "customer.subscription.trial_will_end":
        subscription = event.data.object as Stripe.Subscription;
        status = subscription.status;
        console.log(`Subscription status is ${status}.`);
        // Then define and call a method to handle the subscription trial ending.
        // handleSubscriptionTrialEnding(subscription);
        break;
      case "customer.subscription.deleted":
        subscription = event.data.object as Stripe.Subscription;
        status = subscription.status;
        console.log(`Subscription status is ${status}.`);
        // Then define and call a method to handle the subscription deleted.
        // handleSubscriptionDeleted(subscriptionDeleted);
        break;
      case "customer.subscription.created":
        subscription = event.data.object as Stripe.Subscription;
        status = subscription.status;
        console.log(`Subscription status is ${status}.`);
        // Then define and call a method to handle the subscription created.
        // handleSubscriptionCreated(subscription);
        break;
      case "customer.subscription.updated":
        subscription = event.data.object as Stripe.Subscription;
        status = subscription.status;
        console.log(`Subscription status is ${status}.`);
        // Then define and call a method to handle the subscription update.
        // handleSubscriptionUpdated(subscription);
        break;
      default:
        // Unexpected event type
        console.log(`Unhandled event type ${event.type}.`);
    }
    // Return a 200 response to acknowledge receipt of the event
    res.status(200);
    return;
  }
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  switch (req.method) {
    case "POST":
      await postHandler(req, res);
      break;
    default:
      res.status(405);
      break;
  }
}
