import Stripe from "stripe";
import { convertStripeTimestampToAppTimestampWithBuffer } from "../../../common/utils";
import { provisionSubscriptionForTeam } from "../../teams/server/db";
import { getStripeSubscription } from "../subscriptions";

export async function handleCheckoutSessionCompleted(
  session: Stripe.Checkout.Session
) {
  try {
    const customerId = session.customer as string;

    const subscriptionId = session.subscription as string;
    const subscription = await getStripeSubscription(subscriptionId);

    const teamId = session.metadata!["team_id"];

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
    console.log(err);
    throw err;
  }
}
