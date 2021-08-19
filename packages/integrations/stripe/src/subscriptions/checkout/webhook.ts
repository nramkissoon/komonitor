import { NextApiRequest, NextApiResponse } from "next";
import Stripe from "stripe";
import { serverSideGetStripe } from "../../utils/getStripe";
import { EventTypes } from "../../utils/constants";
import { EventHandlers } from "./eventHandler";

/**
 * Webhook middleware for handling Stripe events.
 *
 * @param webhookSecret
 * @param stripeSecretKey
 * @param eventHandlers event handler methods for webhook events
 * @param handler Next.js API handler function
 */
export const stripeSubscriptionWebhookMiddleware =
  (
    webhookSecret: string,
    stripeSecretKey: string,
    eventHandlers: EventHandlers,
    handler: (req: NextApiRequest, res: NextApiResponse) => void
  ) =>
  async (req: NextApiRequest, res: NextApiResponse) => {
    const stripe = serverSideGetStripe(stripeSecretKey);

    if (webhookSecret) {
      let event: Stripe.Event;
      const signature = req.headers["stripe-signature"];

      // try to verify the signature
      try {
        event = stripe.webhooks.constructEvent(
          req.body,
          signature!,
          webhookSecret
        );

        try {
          // handle the event on the backend
          await handleEvent(event, eventHandlers);
          handler(req, res);
        } catch (error) {
          // server error
          res.status(500);
          return handler(req, res);
        }

        res.status(200);
        handler(req, res);
      } catch (error) {
        res.status(400);
        handler(req, res);
      }
    } else {
      // enforce webhook secret is present even though it is only recommended
      res.status(500);
      handler(req, res);
    }
  };

/**
 * Method for handling various events that Stripe sends as a part of Checkout and subscriptions.
 * For each event, you should implement the required functionality for your specific use case in ./eventHandlers.ts
 *
 * @param event [Stripe Event](https://stripe.com/docs/api/events)
 * @param eventHandlers event handler methods for webhook events
 * @returns
 */
export const handleEvent = async (
  event: Stripe.Event,
  eventHandlers: EventHandlers
) => {
  const { type, data, id } = event;

  if (!(await eventHandlers.checkEventIdNotProcessed(id))) {
    return;
  }

  try {
    switch (type) {
      case EventTypes.CHECKOUT_SESSION_COMPLETED:
        await eventHandlers.provisionSubscriptionOnCheckoutSessionCompleted(
          data
        );
        break;
      case EventTypes.INVOICE_PAID:
        await eventHandlers.provisionSubscriptionOnInvoicePaid(data);
        break;
      case EventTypes.INVOICE_PAYMENT__FAILED:
        await eventHandlers.notifyCustomerOnPaymentMethodFailure(data);
        break;
      case EventTypes.INVOICE_PAYMENT__ACTION__REQUIRED:
        await eventHandlers.notifyCustomerOnPaymentActionRequired(data);
        break;
      case EventTypes.CUSTOMER_SUBSCRIPTION_UPDATED:
        await eventHandlers.handleCustomerSubscriptionUpdated(data);
        break;
      default:
        // fall through for events that do not need any particular handling
        break;
    }
  } catch (error) {
    // throw any errors up to webhook endpoint to indicate we have not handled the event correctly.
    throw error;
  }

  eventHandlers.addEventIdToDb(id);
};
