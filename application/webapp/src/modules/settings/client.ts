import router from "next/router";
import { WebhookSecret } from "utils";
import { env } from "../../common/client-utils";
import { PLAN_PRODUCT_IDS } from "../billing/plans";
import { useTeam } from "../teams/client";
import { useUser } from "../user/client";

const userTzApiUrl = env.BASE_URL + "api/user/tz";
const emailOptInApiUrl = env.BASE_URL + "api/user/email-opt-in";
const webhookSecretApiUrl = env.BASE_URL + "api/webhooks";
const teamApiUrl = env.BASE_URL + "api/teams";

export async function createAndRedirectToCustomerPortal(teamId?: string) {
  const response = await fetch(
    "/api/billing/customer-portal" + (teamId ? `?teamId=${teamId}` : ""),
    {
      method: "POST",
      body: "",
    }
  );
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

export async function updateEmailOptIn(
  optIn: boolean,
  onSuccess: (message: string) => void,
  onError: (message: string) => void
) {
  const response = await fetch(emailOptInApiUrl, {
    method: "POST",
    headers: {
      "Content-type": "application/json; charset=UTF-8",
    },
    body: JSON.stringify({ optIn }),
  });

  if (response.ok) {
    onSuccess("Email opt-in preference updated successfully.");
  } else {
    let errorMessage;
    switch (response.status) {
      case 500:
        errorMessage = "Internal server error. Please try again later.";
      default:
        errorMessage = "An unknown error occurred. Please try again later.";
    }
    onError(errorMessage);
  }
}

export const useWebhookSecret = (teamId?: string) => {
  const { team, teamFetchError, teamIsLoading, mutateTeams } = useTeam(
    teamId ?? ""
  );
  const { user, userIsError, userIsLoading, userMutate } = useUser();

  if (teamId) {
    return {
      secret: team ? (team.webhook_secret as WebhookSecret) : undefined,
      secretIsLoading: teamIsLoading,
      secretIsError: teamFetchError,
      secretMutate: mutateTeams,
    };
  }

  return {
    secret: user ? (user.webhook_secret as WebhookSecret) : undefined,
    secretIsLoading: userIsLoading,
    secretIsError: userIsError,
    secretMutate: userMutate,
  };
};

export const useProductId = (teamId?: string) => {
  const { team, teamFetchError, teamIsLoading, mutateTeams } = useTeam(
    teamId ?? ""
  );
  const { user, userIsError, userIsLoading, userMutate } = useUser();

  if (teamId) {
    return {
      productId: team ? team.product_id ?? PLAN_PRODUCT_IDS.STARTER : undefined,
      productIdIsLoading: teamIsLoading,
      productIdIsError: teamFetchError,
      productIdMutate: mutateTeams,
    };
  }

  return {
    productId: user ? user.product_id ?? PLAN_PRODUCT_IDS.STARTER : undefined,
    productIdIsLoading: userIsLoading,
    productIdIsError: userIsError,
    productIdMutate: userMutate,
  };
};

export async function createWebhookSecret(teamId?: string) {
  const response = await fetch(
    webhookSecretApiUrl + (teamId ? `?teamId=${teamId}` : ""),
    { method: "POST" }
  );
  if (response.ok) return true;
  return false;
}

export async function deleteWebhookSecret(
  teamId?: string,
  onError?: (message: string) => void
) {
  const response = await fetch(
    webhookSecretApiUrl + (teamId ? `?teamId=${teamId}` : ""),
    { method: "DELETE" }
  );
  if (response.ok) {
  } else {
    let errorMessage;
    switch (response.status) {
      case 500:
        errorMessage =
          "Internal server error. Please try again later or contact us.";
        break;
      default:
        errorMessage = "An unknown error occurred. Please try again later.";
    }
    onError ? onError(errorMessage) : undefined;
    return false;
  }
  return true;
}

export const deleteTeam = async (
  teamId: string,
  onError?: (message: string) => void
) => {
  const response = await fetch(teamApiUrl + `?teamId=${teamId}`, {
    method: "DELETE",
  });
  if (response.ok) {
  } else {
    let errorMessage;
    switch (response.status) {
      case 500:
        errorMessage =
          "Internal server error. Please try again later or contact us.";
        break;
      default:
        errorMessage = "An unknown error occurred. Please try again later.";
    }
    onError ? onError(errorMessage) : undefined;
    return false;
  }
  return true;
};
