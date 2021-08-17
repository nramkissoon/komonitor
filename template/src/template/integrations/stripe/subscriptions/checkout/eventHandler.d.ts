import Stripe from "stripe";

type EventHandler = (data: Stripe.Event.Data) => Promise<void>;

export interface EventHandlers {
  /**
   * @description function to provision a product upon receiving a Stripe [checkout.session.completed Event](https://stripe.com/docs/api/events/types#event_types-checkout.session.completed)
   *
   * @todo link Stripe Customer ID to the applications user database by using the [client_reference_id](https://stripe.com/docs/api/checkout/sessions/object#checkout_session_object-client_reference_id)
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
  restrictAccessOnDeletedSubscription: EventHandler;
  handleCustomerSubscriptionUpdated: EventHandler;
  notifyCustomerOnPaymentMethodFailure: EventHandler;
}

export const provisionSubscriptionOnSessionCompleted = async (
  data: Stripe.Event.Data
) => {
  // TODO link Stripe Customer ID in user DB using client reference ID
  // TODO Based on price ID provision product.
};

export const provisionSubscriptionOnInvoicePaid = async (
  data: Stripe.Event.Data
) => {
  // TODO continue to provision product ID
};

export const restrictAccessOnDeletedSubscription = async (
  data: Stripe.Event.Data
) => {
  // TODO restrict access to product ID on deleted subscription
};

export const handleCustomerSubscriptionUpdated = async (
  data: Stripe.Event.Data
) => {
  // TODO handle changes in priceID
  // TODO handle changes in quantity
};
