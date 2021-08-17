import { NextApiRequest, NextApiResponse } from "next";
import Stripe from "stripe";
import { serverSideGetStripe } from "../../getStripe";
import { EventTypes } from "../../utils/constants";
import { addEventIdToDB, eventIdNotProcessed } from "../../utils/eventIdCheck";

export const stripeSubscriptionWebhookHandler = (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  const webhookSecret = process.env.STRIPE_SUBSCRIPTION_WEBHOOK_SECRET;
  const stripe = serverSideGetStripe(process.env.STRIPE_SECRET_KEY!);

  if (webhookSecret) {
    let event: Stripe.Event;
    const signature = req.headers["stripe-signature"];

    try {
      event = stripe.webhooks.constructEvent(
        req.body,
        signature!,
        webhookSecret
      );

      handleEvent(event);
      res.status(200);
    } catch (error) {
      res.status(400);
    }
  } else {
    // enforce webhook secret is present even though it is only recommended
    res.status(500);
  }
};

export const handleEvent = async (event: Stripe.Event) => {
  const { type, data, id } = event;

  if (!(await eventIdNotProcessed(id))) {
    return;
  }

  switch (type) {
    case EventTypes.CHECKOUT_SESSION_COMPLETED:
      break;
    case EventTypes.INVOICE_PAID:
      break;
    case EventTypes.INVOICE_PAYMENT__FAILED:
      break;
  }

  addEventIdToDB(id);
};
