import router from "next/router";
import useSWR from "swr";
import { SlackInstallation, User } from "utils";
import { env } from "../../common/client-utils";

const userPlanApiUrl = env.BASE_URL + "api/user/plan";
export const userTzApiUrl = env.BASE_URL + "api/user/tz";
export const userApiUrl = env.BASE_URL + "api/user";
export const userSlackInstallationApiUrl =
  env.BASE_URL + "api/user/slack-installations";
export const userWebhookSecretApiUrl = env.BASE_URL + "/api/user/webhooks";

export function useUserServicePlanProductId() {
  const fetcher = (url: string) =>
    fetch(url, { method: "GET" }).then((r) => r.json());
  const { data, error } = useSWR(userPlanApiUrl, fetcher);
  return {
    data: data as { productId: string },
    isLoading: !error && !data,
    isError: error,
  };
}

export function useUserTimezoneAndOffset() {
  const fetcher = (url: string) =>
    fetch(url, { method: "GET" }).then((r) => r.json());

  const { data, error, mutate } = useSWR(userTzApiUrl, fetcher);
  return {
    data: data as { tz: string; offset: number },
    isLoading: !error && !data,
    isError: error,
    mutate: mutate,
  };
}

export function useUser() {
  const fetcher = (url: string) =>
    fetch(url, { method: "GET" }).then((r) => r.json());

  const { data, error, mutate } = useSWR(userApiUrl, fetcher);

  return {
    user: data as User,
    userIsLoading: !error && !data,
    userIsError: error,
    userMutate: mutate,
  };
}

export function useUserWebhookSecret() {
  const fetcher = (url: string) =>
    fetch(url, { method: "GET" }).then((r) => r.json());

  const { data, error, mutate } = useSWR(userApiUrl, fetcher);

  return {
    secret: data ? (data as User).webhook_secret : undefined,
    secretIsLoading: !error && !data,
    secretIsError: error,
    secretMutate: mutate,
  };
}

export function useUserSlackInstallations() {
  const fetcher = (url: string) =>
    fetch(url, { method: "GET" }).then((r) => r.json());

  const { data, error, mutate } = useSWR(
    userSlackInstallationApiUrl,
    fetcher,
    {}
  );

  return {
    data: data as SlackInstallation[] | undefined,
    isLoading: !error && !data,
    isError: error,
    mutate: mutate,
  };
}

export type Integrations = {
  data: SlackInstallation<"v1" | "v2", boolean> | undefined;
  type: "Slack";
  mutate: () => void;
}[];

// used to grab all user integrations at once
export function useUserIntegrations() {
  const { data, isError, mutate, isLoading } = useUserSlackInstallations();
  const slackIntegrations: Integrations = data
    ? data.map((integ) => ({ data: integ, type: "Slack", mutate: mutate }))
    : [];
  return {
    integrations: [...slackIntegrations] as Integrations,
    isError,
    isLoading,
  };
}

export async function deleteUser(onError: (message: string) => void) {
  const response = await fetch(userApiUrl, { method: "DELETE" });
  if (response.ok) {
    router.push("/");
  } else {
    let errorMessage;
    switch (response.status) {
      case 403:
        errorMessage =
          "You must cancel all of your  team subscriptions before deleting your account.";
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
    // ye mum was here
  }
  return true;
}
