import Stripe from "stripe";
import { convertStripeTimestampToAppTimestampWithBuffer } from "../../../common/utils";
import {
  deleteTeamAndAssociatedAssets,
  provisionSubscriptionForTeam,
} from "../../teams/server/db";
import { getStripeCustomer } from "../customer";

export async function handleCustomerSubscriptionDeleted(
  subscription: Stripe.Subscription
) {
  try {
    const customerId = subscription.customer as string;
    const userId = ((await getStripeCustomer(customerId)) as Stripe.Customer)
      .metadata["user_id"];

    const teamId = subscription.metadata["team_id"];

    // delete team and associated assets

    const deleted = await deleteTeamAndAssociatedAssets(teamId);

    // TODO do some logging
    // TODO mark for deletion
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

    const teamId = subscription.metadata["team_id"];

    await provisionSubscriptionForTeam({
      teamId,
      subscriptionId: subscription.id,
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
