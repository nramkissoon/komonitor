import Stripe from "stripe";
import { ddbClient, env } from "../../../common/server-utils";
import { provisionSubscriptionProductForUser } from "../../user/user-db";
import { getStripeCustomer } from "../customer";
import { getStripeSubscription } from "../subscriptions";

export async function handleInvoicePaid(invoice: Stripe.Invoice) {
  try {
    const customerId = invoice.customer as string;
    const userId = ((await getStripeCustomer(customerId)) as Stripe.Customer)
      .metadata["user_id"];

    const subscriptionId = invoice.subscription as string;
    const subscription = await getStripeSubscription(subscriptionId);

    // continue provisioning subscription
    await provisionSubscriptionProductForUser(
      ddbClient,
      env.USER_TABLE_NAME,
      userId,
      subscriptionId,
      subscription.status,
      subscription.current_period_end,
      subscription.items.data[0].price.product as string
    );
  } catch (err) {
    console.error(err);
    throw err;
  }
}
