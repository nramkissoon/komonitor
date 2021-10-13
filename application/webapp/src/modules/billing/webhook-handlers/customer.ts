import Stripe from "stripe";
import { ddbClient, env } from "../../../common/server-utils";
import { convertStripeTimestampToAppTimestampWithBuffer } from "../../../common/utils";
import {
  downgradeUserToFreePlan,
  provisionSubscriptionProductForUser,
} from "../../user/user-db";
import { getStripeCustomer } from "../customer";

export async function handleCustomerSubscriptionDeleted(
  subscription: Stripe.Subscription
) {
  try {
    const customerId = subscription.customer as string;
    const userId = ((await getStripeCustomer(customerId)) as Stripe.Customer)
      .metadata["user_id"];

    await downgradeUserToFreePlan(ddbClient, env.USER_TABLE_NAME, userId);
  } catch (err) {
    console.error(err);
    throw err;
  }
}

export async function handleCustomerSubscriptionUpdated(
  subscription: Stripe.Subscription
) {
  try {
    const customerId = subscription.customer as string;
    const userId = ((await getStripeCustomer(customerId)) as Stripe.Customer)
      .metadata["user_id"];

    await provisionSubscriptionProductForUser(
      ddbClient,
      env.USER_TABLE_NAME,
      userId,
      subscription.id,
      subscription.status,
      convertStripeTimestampToAppTimestampWithBuffer(
        subscription.current_period_end
      ),
      subscription.items.data[0].price.product as string
    );
  } catch (err) {
    console.error(err);
    throw err;
  }
}
