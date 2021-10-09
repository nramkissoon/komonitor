import router from "next/router";

export async function createAndRedirectToCustomerPortal() {
  const response = await fetch("/api/billing/customer-portal", {
    method: "POST",
    body: "",
  });
  const stripeUrl = (await response.json()).url;
  router.push(stripeUrl);
}
