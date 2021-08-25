import { NextApiRequest, NextApiResponse } from "next";
import { serverSideGetStripe } from "./utils/getStripe";
import winston from "winston";

/**
 * Next.js API middleware function for creating a Stripe Customer Portal.
 *
 * @param returnUrl URL to return to when user is finished in portal
 * @param stripeSecretKey stripe secret key
 * @param getCustomerId a function to get the Stripe Customer ID or the ID itself
 * @param req NextApiRequest
 * @param res NextApiResponse
 * @param logger winston Logger for logging
 */
export const createCustomerPortalSessionMiddleware = async (
  returnUrl: string,
  stripeSecretKey: string,
  getCustomerId: (userId: string) => Promise<string> | string,
  req: NextApiRequest,
  res: NextApiResponse,
  logger?: winston.Logger
) => {
  if (req.method === "POST") {
    const { body } = req;
    const { userId } = body;

    if (!userId) {
      logger?.warn("no user ID");
      res.status(400).end("Bad Request");
      return;
    }

    try {
      const customerId: string = await getCustomerId(userId);

      const stripe = serverSideGetStripe(stripeSecretKey);
      const session = await stripe.billingPortal.sessions.create({
        customer: customerId,
        return_url: returnUrl,
      });

      res.redirect(302, session.url);
      return;
    } catch (error) {
      logger?.error((error as Error).message);
      res.status(500);
      return;
    }
  } else {
    logger?.warn(`${req.method} method not allowed.`);
    res.setHeader("Allow", "POST");
    res.status(405).end("Method Not Allowed");
    return;
  }
};
