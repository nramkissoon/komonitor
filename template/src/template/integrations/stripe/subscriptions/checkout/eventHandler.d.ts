import Stripe from "stripe";
import {
  AddEventIdToDb,
  CheckEventIdNotProcessed,
} from "../../utils/eventIdCheck";

type EventHandler = (data: Stripe.Event.Data) => Promise<void>;

/**
 * @description Stripe webhook event handlers for subscription events.
 *
 * @see [Using webhooks with subscriptions](https://stripe.com/docs/billing/subscriptions/webhooks)
 */
export interface EventHandlers {
  /**
   * @description function to provision a product upon receiving a Stripe [checkout.session.completed Event](https://stripe.com/docs/api/events/types#event_types-checkout.session.completed)
   *
   * @todo provision the product specified in the [line_items](https://stripe.com/docs/api/checkout/sessions/object#checkout_session_object-line_items)
   * @todo throw any errors to indicate a server error has occurred
   */
  provisionSubscriptionOnCheckoutSessionCompleted: EventHandler;

  /**
   * @description function to continue provisioning a product upon receiving a Stripe [invoice.paid Event](https://stripe.com/docs/api/events/types#event_types-invoice.paid)
   *
   * @todo continue to provision the product specified in the [line_items](https://stripe.com/docs/api/checkout/sessions/object#checkout_session_object-line_items)
   * @todo throw any errors to indicate a server error has occurred
   */
  provisionSubscriptionOnInvoicePaid: EventHandler;

  /**
   * @description function to handle subscription updates upon receiving a Stripe [customer.subscription.updated](https://stripe.com/docs/api/events/types#event_types-customer.subscription.updated)
   *
   * @see [How subscriptions work](https://stripe.com/docs/billing/subscriptions/overview)
   *
   * @todo handle a canceled subscription
   * @todo handle unpaid subscription if applicable
   * @todo handle past due subscription if applicable
   * @todo
   * @todo throw any errors to indicate a server error has occurred
   */
  handleCustomerSubscriptionUpdated: EventHandler;

  /**
   * @description function to notify the customer that their payment has failed upon receiving a Stripe [invoice.payment_failed Event](https://stripe.com/docs/api/events/types#event_types-invoice.payment_failed)
   *
   * @todo create a [Stripe Customer Portal](https://stripe.com/docs/billing/subscriptions/customer-portal) to direct the customer to and send notification.
   * @todo throw any errors to indicate a server error has occurred
   */
  notifyCustomerOnPaymentMethodFailure: EventHandler;

  /**
   * @description function to notify the customer that their payment has failed upon receiving a Stripe [invoice.payment_action_required Event](https://stripe.com/docs/api/events/types#event_types-invoice.payment_action_required)
   *
   * @todo create a [Stripe Customer Portal](https://stripe.com/docs/billing/subscriptions/customer-portal) to direct the customer to and send notification.
   * @todo throw any errors to indicate a server error has occurred
   */
  notifyCustomerOnPaymentActionRequired: EventHandler;

  /**
   * @description function that checks whether or not a given Event ID has been previously processed.
   *
   * @todo check DB if Event ID is processed
   * @todo return true if not processed, false otherwise
   * @todo throw error if unable to determine if the ID is processed to avoid reprocessing
   */
  checkEventIdNotProcessed: CheckEventIdNotProcessed;

  /**
   * @description function that adds the event ID to a list of processed event ID's in the DB
   *
   * @todo connect to DB and add event ID
   */
  addEventIdToDb: AddEventIdToDb;
}
