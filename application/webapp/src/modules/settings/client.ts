import router from "next/router";
import { env } from "../../common/client-utils";

const userTzApiUrl = env.BASE_URL + "api/user/tz";

export async function createAndRedirectToCustomerPortal() {
  const response = await fetch("/api/billing/customer-portal", {
    method: "POST",
    body: "",
  });
  const stripeUrl = (await response.json()).url;
  router.push(stripeUrl);
}

export async function updateTimezonePreference(
  data: any,
  onSuccess: (message: string) => void,
  onError: (message: string) => void
) {
  const response = await fetch(userTzApiUrl, {
    method: "POST",
    headers: {
      "Content-type": "application/json; charset=UTF-8",
    },
    body: JSON.stringify(data),
  });

  if (response.ok) {
    onSuccess("Timezone preference saved successfully.");
  } else {
    let errorMessage;
    switch (response.status) {
      case 400:
        errorMessage = "Invalid user input.";
        break;
      case 500:
        errorMessage = "Internal server error. Please try again later.";
      default:
        errorMessage = "An unknown error occurred. Please try again later.";
    }
    onError(errorMessage);
  }
}
