import router from "next/router";
import { Team, TeamPermissionLevel, User, WebhookSecret } from "utils";
import { env } from "../../common/client-utils";
import { PLAN_PRODUCT_IDS } from "../billing/plans";
import { useTeam } from "../teams/client";
import { useUser } from "../user/client";

const userTzApiUrl = env.BASE_URL + "api/user/tz";
const emailOptInApiUrl = env.BASE_URL + "api/user/email-opt-in";
const webhookSecretApiUrl = env.BASE_URL + "api/webhooks";
const teamApiUrl = env.BASE_URL + "api/teams";
const teamInviteApiUrl = env.BASE_URL + "api/teams/invites";
const teamMemberApiUrl = env.BASE_URL + "api/teams/members";

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

export const createInvite = async (
  teamId: string,
  email: string,
  permission: TeamPermissionLevel,
  onSuccess: (message: string) => void,
  onError: (message: string) => void
) => {
  const response = await fetch(teamInviteApiUrl + `?teamId=${teamId}`, {
    method: "POST",
    headers: {
      "Content-type": "application/json; charset=UTF-8",
    },
    body: JSON.stringify({ email, permission }),
  });

  if (response.ok) {
    onSuccess("Invite sent!");
    return true;
  } else {
    let errorMessage;
    switch (response.status) {
      case 400:
        errorMessage = "Invalid request.";
        break;
      case 403:
        errorMessage = "You are not authorized to perform this action.";
        break;
      case 500:
        errorMessage =
          "Internal server error. Please try again later or contact us.";
        break;
      default:
        errorMessage = "An unknown error occurred. Please try again later.";
    }
    onError(errorMessage);
    return false;
  }
};

export const deleteInvite = async (
  teamId: string,
  email: string,
  onSuccess: (message: string) => void,
  onError: (message: string) => void
) => {
  const response = await fetch(teamInviteApiUrl + `?teamId=${teamId}`, {
    method: "DELETE",
    headers: {
      "Content-type": "application/json; charset=UTF-8",
    },
    body: JSON.stringify({ email }),
  });

  if (response.ok) {
    onSuccess("Invite deleted.");
    return true;
  } else {
    let errorMessage;
    switch (response.status) {
      case 400:
        errorMessage = "Invalid request.";
      case 403:
        errorMessage = "You are not authorized to perform this action.";
      case 500:
        errorMessage =
          "Internal server error. Please try again later or contact us.";
        break;
      default:
        errorMessage = "An unknown error occurred. Please try again later.";
    }
    onError(errorMessage);
    return false;
  }
};

export const deleteMember = async (
  teamId: string,
  userToDelete: string,
  onSuccess: (message: string) => void,
  onError: (message: string) => void
) => {
  const response = await fetch(teamMemberApiUrl + `?teamId=${teamId}`, {
    method: "DELETE",
    headers: {
      "Content-type": "application/json; charset=UTF-8",
    },
    body: JSON.stringify({ userToDelete }),
  });
  if (response.ok) {
    onSuccess("Member removed.");
    return true;
  } else {
    let errorMessage;
    switch (response.status) {
      case 400:
        errorMessage = "Invalid request.";
      case 403:
        errorMessage = "You are not authorized to perform this action.";
      case 500:
        errorMessage =
          "Internal server error. Please try again later or contact us.";
        break;
      default:
        errorMessage = "An unknown error occurred. Please try again later.";
    }
    onError(errorMessage);
    return false;
  }
};

export const getUserPermissionLevel = (
  user: User,
  team: Team
): TeamPermissionLevel | null => {
  if (!user || !team) return null;
  for (let member of team.members) {
    if (member.user_id === user.id) {
      return member.permission_level;
    }
  }
  return null;
};
