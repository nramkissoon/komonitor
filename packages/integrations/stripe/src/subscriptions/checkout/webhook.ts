import { NextApiRequest, NextApiResponse } from "next";
import Stripe from "stripe";
import { serverSideGetStripe } from "../../utils/getStripe";
import { EventTypes } from "../../utils/constants";
import { CheckoutSubscriptionEventHandlers } from "./eventHandler";
import winston from "winston";

/**
 * Webhook middleware for handling Stripe events.
 *
 * @param webhookSecret
 * @param stripeSecretKey
 * @param eventHandlers event handler methods for webhook events
 * @param req NextApiRequest
 * @param res NextApiResponse
 * @param logger winston Logger for logging
 */
export const stripeSubscriptionWebhookMiddleware = async (
  webhookSecret: string,
  stripeSecretKey: string,
  eventHandlers: CheckoutSubscriptionEventHandlers,
  req: NextApiRequest,
  res: NextApiResponse,
  logger?: winston.Logger
): Promise<void> => {
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
        await handleEvent(event, eventHandlers, logger);
        res.status(200).end("ok");
        return;
      } catch (error) {
        // server error
        logger?.error((error as Error).message);
        res.status(500).end();
        return;
      }
    } catch (error) {
      logger?.error((error as Error).message);
      res.status(400).end();
      return;
    }
  } else {
    // enforce webhook secret is present even though it is only recommended
    logger?.error("Missing webhook secret.");
    res.status(500);
    return;
  }
};

/**
 * Method for handling various events that Stripe sends as a part of Checkout and subscriptions.
 * For each event, you should implement the required functionality for your specific use case in ./eventHandlers.ts
 *
 * @param event [Stripe Event](https://stripe.com/docs/api/events)
 * @param eventHandlers event handler methods for webhook events
 * @param logger winston Logger for logging
 * @returns
 */
export const handleEvent = async (
  event: Stripe.Event,
  eventHandlers: CheckoutSubscriptionEventHandlers,
  logger?: winston.Logger
) => {
  const { type, data, id } = event;

  try {
    if (!(await eventHandlers.checkEventIdNotProcessed(id))) {
      logger?.info(`Event ID: ${id} already processed.`);
      return;
    }
  } catch (error) {
    logger?.error(`unable to check if ID ${id} is in DB`);
    return;
  }

  try {
    switch (type) {
      case EventTypes.CHECKOUT_SESSION_COMPLETED:
        await eventHandlers.provisionSubscriptionOnCheckoutSessionCompleted(
          data,
          logger
        );
        break;
      case EventTypes.INVOICE_PAID:
        await eventHandlers.provisionSubscriptionOnInvoicePaid(data, logger);
        break;
      case EventTypes.INVOICE_PAYMENT__FAILED:
        await eventHandlers.notifyCustomerOnPaymentMethodFailure(data, logger);
        break;
      case EventTypes.INVOICE_PAYMENT__ACTION__REQUIRED:
        await eventHandlers.notifyCustomerOnPaymentActionRequired(data, logger);
        break;
      case EventTypes.CUSTOMER_SUBSCRIPTION_UPDATED:
        await eventHandlers.handleCustomerSubscriptionUpdated(data, logger);
        break;
      default:
        // fall through for events that do not need any particular handling
        logger?.info(`unhandled event type: ${type}`);
        break;
    }
  } catch (error) {
    // throw any errors up to webhook endpoint to indicate we have not handled the event correctly.
    throw error;
  }

  eventHandlers.addEventIdToDb(id);
};
