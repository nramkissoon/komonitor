import { NextApiRequest, NextApiResponse } from "next";
import Stripe from "stripe";
import {
  clientSideGetStripe,
  serverSideGetStripe,
} from "../../utils/getStripe";
import winston from "winston";

const checkoutSessionFetch = async (
  priceId: string[],
  createCheckoutApiUrl: string,
  userId: string,
  userEmail: string,
  successUrl: string,
  cancelUrl: string,
  clientErrorHandler: (message: string | undefined) => void
) => {
  try {
    const response = await fetch(createCheckoutApiUrl, {
      method: "POST",
      mode: "cors",
      cache: "no-cache",
      credentials: "same-origin",
      headers: {
        "Content-Type": "application/json",
      },
      redirect: "follow",
      referrerPolicy: "no-referrer",
      body: JSON.stringify({
        priceIds: priceId,
        userId: userId,
        userEmail: userEmail,
        successUrl: successUrl,
        cancelUrl: cancelUrl,
      }),
    });

    return await response.json();
  } catch (err: any) {
    clientErrorHandler(err.message);
  }
};

/**
 * Call the server side API for creating a Stripe Checkout Session then redirect the user
 * to the checkout page.
 *
 * @see https://stripe.com/docs/billing/subscriptions/checkout#create-session
 *
 * @param priceId [Stripe Price id]https://stripe.com/docs/api/prices/object#price_object-id
 * @param createCheckoutApiUrl server API route to call for creating checkout session
 * @param userId [Stripe client_reference_id](https://stripe.com/docs/api/checkout/sessions/create#create_checkout_session-client_reference_id)
 * @param userEmail [Stripe customer_email](https://stripe.com/docs/api/checkout/sessions/create#create_checkout_session-customer_email)
 * @param successUrl [Stripe success_url](https://stripe.com/docs/api/checkout/sessions/create#create_checkout_session-success_url)
 * @param cancelUrl [Stripe cancel_url](https://stripe.com/docs/api/checkout/sessions/create#create_checkout_session-cancel_url)
 * @param serverErrorHandler function to call when server returns error
 * @param clientErrorHandler function to call when client returns error during redirect to checkout page
 */
export const clientCreateStripeSessionAndRedirect = async (
  priceId: string[],
  createCheckoutApiUrl: string,
  userId: string,
  userEmail: string,
  successUrl: string,
  cancelUrl: string,
  stripePublicKey: string,
  serverErrorHandler: (message: string) => void,
  clientErrorHandler: (message: string | undefined) => void
) => {
  const response: Stripe.Checkout.Session = await checkoutSessionFetch(
    priceId,
    createCheckoutApiUrl,
    userId,
    userEmail,
    successUrl,
    cancelUrl,
    clientErrorHandler
  );

  if ((response as any).statusCode === 500) {
    serverErrorHandler(
      "Server Error: Checkout is not available right now. Please try again later or contact us."
    );
  }

  const stripe = await clientSideGetStripe(stripePublicKey);
  const { error } = await stripe!.redirectToCheckout({
    sessionId: response.id,
  });

  clientErrorHandler(error.message);
};

/**
 * Next.js API middleware function for creating a Stripe checkout session for a subscription product.
 *
 * @param stripeSecretKey string
 * @param createOrRetrieveStripeCustomerId a function to call DB and Stripe to either create a new Stripe Customer or retrieve it, returns the customer ID
 * @param handler Next.js API handler function
 * @param logger winston Logger for logging
 */
export const createSessionApiMiddleware =
  (
    stripeSecretKey: string,
    createOrRetrieveStripeCustomerId: (userId: string) => Promise<string>,
    handler: (req: NextApiRequest, res: NextApiResponse) => void,
    logger?: winston.Logger
  ) =>
  async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method === "POST") {
      const { body } = req;
      const { userEmail, userId, priceIds, successUrl, cancelUrl } = body;

      if (!userEmail || !userId || !priceIds || !successUrl || !cancelUrl) {
        logger?.warn("Bad request sent.");
        logger?.verbose(body.toString());
        res.status(400).end("Bad Request");
        return handler(req, res);
      }

      try {
        const stripe = serverSideGetStripe(stripeSecretKey);

        const customerId = await createOrRetrieveStripeCustomerId(userId);

        const checkoutSession: Stripe.Checkout.Session =
          await stripe.checkout.sessions.create({
            mode: "subscription",
            customer_email: userEmail,
            client_reference_id: userId,
            customer: customerId,
            payment_method_types: ["card"],
            line_items: priceIds.map((priceId: string) => ({
              priceId: priceId,
              quantity: 1,
            })),
            automatic_tax: {
              enabled: true,
            },
            success_url: successUrl + "?session_id={CHECKOUT_SESSION_ID}",
            cancel_url: cancelUrl + "?session_id={CHECKOUT_SESSION_ID}",
          });

        res.status(200).json(checkoutSession);
        return handler(req, res);
      } catch (error: any) {
        logger?.error(error.message);
        res.status(500).json({ statusCode: 500, message: error.message });
        return handler(req, res);
      }
    } else {
      res.setHeader("Allow", "POST");
      res.status(405).end("Method Not Allowed");
      logger?.warn(`${req.method} method sent. Method not allowed.`);
      return handler(req, res);
    }
  };
