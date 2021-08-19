import { NextApiRequest, NextApiResponse } from "next";
import { serverSideGetStripe } from "../utils/getStripe";

/**
 * Next.js API middleware function for creating a Stripe Customer Portal.
 *
 * @param returnUrl URL to return to when user is finished in portal
 * @param stripeSecretKey stripe secret key
 * @param getCustomerId a function to get the Stripe Customer ID or the ID itself
 * @param handler API handler
 */
export const createCustomerPortalSessionMiddleware =
  (
    returnUrl: string,
    stripeSecretKey: string,
    getCustomerId: (userId: string) => Promise<string> | string,
    handler: (req: NextApiRequest, res: NextApiResponse) => void
  ) =>
  async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method === "POST") {
      const { body } = req;
      const { userId } = body;

      if (!userId) {
        res.status(400).end("Bad Request");
        return handler(req, res);
      }

      try {
        const customerId: string = await getCustomerId(userId);

        const stripe = serverSideGetStripe(stripeSecretKey);
        const session = await stripe.billingPortal.sessions.create({
          customer: customerId,
          return_url: returnUrl,
        });

        res.redirect(302, session.url);
        return handler(req, res);
      } catch (error) {
        res.status(500);
        return handler(req, res);
      }
    } else {
      res.setHeader("Allow", "POST");
      res.status(405).end("Method Not Allowed");
      return handler(req, res);
    }
  };
