import { Stripe as ClientStripe, loadStripe } from "@stripe/stripe-js";
import { Stripe } from "stripe";

/**
 * IMPORTANT
 *
 * This is a singleton fo the CLIENT SIDE Stripe instance to avoid reinstating Stripe on every render.
 */
let clientStripePromise: Promise<ClientStripe | null>;

export const clientSideGetStripe = (stripePublishableKey: string) => {
  if (!clientStripePromise) {
    clientStripePromise = loadStripe(stripePublishableKey);
  }
  return clientStripePromise;
};

/**
 * IMPORTANT
 *
 * This is a utility function for getting stripe on SERVER SIDE. DO NOT use on client side because it needs a SECRET KEY.
 *
 * @param stripeSecretKey
 */
export const serverSideGetStripe = (stripeSecretKey: string) => {
  return new Stripe(stripeSecretKey, { apiVersion: "2020-08-27" });
};
