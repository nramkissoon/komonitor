import { Stripe } from "stripe";
import { stripeClient } from "../../common/server-utils";

export async function createStripeCustomer(
  userId: string,
  userEmail: string,
  userName?: string
) {
  try {
    const stripeCustomer = await stripeClient.customers.create({
      email: userEmail,
      metadata: { user_id: userId },
      name: userName ?? undefined,
    });
    return stripeCustomer;
  } catch (err) {
    console.error(err);
    throw err;
  }
}

export async function getStripeCustomer(customerId: string) {
  try {
    const stripeCustomer = await stripeClient.customers.retrieve(customerId);
    return stripeCustomer;
  } catch (err) {
    console.error(err);
    throw err;
  }
}

export async function updateStripeCustomer(
  customerId: string,
  updateParams: Stripe.CustomerUpdateParams
) {
  try {
    const stripeCustomer = await stripeClient.customers.update(
      customerId,
      updateParams
    );
    return stripeCustomer;
  } catch (err) {
    console.error(err);
    throw err;
  }
}

export async function deleteStripeCustomer(customerId: string) {
  try {
    const result = await stripeClient.customers.del(customerId);
    return result;
  } catch (err) {
    console.error(err);
    throw err;
  }
}
