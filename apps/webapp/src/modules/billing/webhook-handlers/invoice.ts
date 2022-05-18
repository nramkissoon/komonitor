import Stripe from "stripe";
import { convertStripeTimestampToAppTimestampWithBuffer } from "../../../common/utils";
import { provisionSubscriptionForTeam } from "../../teams/server/db";
import { getStripeCustomer } from "../customer";
import { getStripeSubscription } from "../subscriptions";

export async function handleInvoicePaid(invoice: Stripe.Invoice) {
  try {
    const customerId = invoice.customer as string;
    const userId = ((await getStripeCustomer(customerId)) as Stripe.Customer)
      .metadata["user_id"];

    const subscriptionId = invoice.subscription as string;
    const subscription = await getStripeSubscription(subscriptionId);

    const teamId = subscription.metadata["team_id"];

    // continue provisioning subscription
    await provisionSubscriptionForTeam({
      teamId,
      subscriptionId,
      subscriptionStatus: subscription.status,
      productId: subscription.items.data[0].price.product as string,
      currentPeriodEnd: convertStripeTimestampToAppTimestampWithBuffer(
        subscription.current_period_end
      ),
      customerId,
    });
  } catch (err) {
    console.error(err);
    throw err;
  }
}
