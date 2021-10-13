import Stripe from "stripe";
import { ddbClient, env } from "../../../common/server-utils";
import { convertStripeTimestampToAppTimestampWithBuffer } from "../../../common/utils";
import { provisionSubscriptionProductForUser } from "../../user/user-db";
import { getStripeCustomer } from "../customer";
import { getStripeSubscription } from "../subscriptions";

export async function handleCheckoutSessionCompleted(
  session: Stripe.Checkout.Session
) {
  try {
    const customerId = session.customer as string;
    const userId = ((await getStripeCustomer(customerId)) as Stripe.Customer)
      .metadata["user_id"];

    const subscriptionId = session.subscription as string;
    const subscription = await getStripeSubscription(subscriptionId);

    await provisionSubscriptionProductForUser(
      ddbClient,
      env.USER_TABLE_NAME,
      userId,
      subscriptionId,
      subscription.status,
      convertStripeTimestampToAppTimestampWithBuffer(
        subscription.current_period_end
      ),
      subscription.items.data[0].price.product as string
    );
  } catch (err) {
    console.log(err);
    throw err;
  }
}
