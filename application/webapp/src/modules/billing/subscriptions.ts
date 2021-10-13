import { stripeClient } from "../../common/server-utils";

export async function getStripeSubscription(subscriptionId: string) {
  try {
    const subscription = await stripeClient.subscriptions.retrieve(
      subscriptionId,
      { expand: ["items"] }
    );
    return subscription;
  } catch (err) {
    console.error(err);
    throw err;
  }
}
