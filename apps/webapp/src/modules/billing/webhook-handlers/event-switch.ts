import Stripe from "stripe";
import { handleCheckoutSessionCompleted } from "./checkout";
import {
  handleCustomerSubscriptionDeleted,
  handleCustomerSubscriptionUpdated,
} from "./customer";
import { handleInvoicePaid } from "./invoice";

export async function handleEvent(event: Stripe.Event) {
  let subscription;
  switch (event.type) {
    case "checkout.session.completed":
      const session = event.data.object as Stripe.Checkout.Session;
      await handleCheckoutSessionCompleted(session);
      break;
    case "invoice.paid":
      const invoice = event.data.object as Stripe.Invoice;
      await handleInvoicePaid(invoice);
      break;
    case "invoice.payment_failed":
      console.log("invoice.payment_failed handled via emails from Stripe");
      break;
    case "customer.subscription.deleted":
      subscription = event.data.object as Stripe.Subscription;
      await handleCustomerSubscriptionDeleted(subscription);
      break;
    case "customer.subscription.updated":
      subscription = event.data.object as Stripe.Subscription;
      await handleCustomerSubscriptionUpdated(subscription);
      break;
    default:
      // Unexpected event type
      console.log(`Unhandled event type ${event.type}.`);
  }
}
