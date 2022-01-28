import router from "next/router";
import { SlackInstallation, User } from "project-types";
import useSWR from "swr";
import { env } from "../../common/client-utils";

const userPlanApiUrl = env.BASE_URL + "api/user/plan";
export const userTzApiUrl = env.BASE_URL + "api/user/tz";
export const userApiUrl = env.BASE_URL + "api/user";
export const userSlackInstallationApiUrl =
  env.BASE_URL + "api/user/slack-installations";

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
}[];

// used to grab all user integrations at once
export function useUserIntegrations() {
  const { data, isError } = useUserSlackInstallations();
  const slackIntegrations: Integrations = data
    ? data.map((integ) => ({ data: integ, type: "Slack" }))
    : [];
  return {
    integrations: [...slackIntegrations] as Integrations,
    isError,
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
          "You must cancel your subscription before deleting your account.";
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

export async function deleteUserSlackInstallation(
  onSuccess: (
    title: string,
    message: string,
    status: "info" | "warning" | "success" | "error"
  ) => void,
  onError: (
    title: string,
    message: string,
    status: "info" | "warning" | "success" | "error"
  ) => void
) {
  const response = await fetch(userSlackInstallationApiUrl, {
    method: "DELETE",
  });
  if (response.ok) {
    onSuccess(
      "Uninstalled Slack",
      "Slack was successfully uninstalled from your workspace.",
      "success"
    );
    return true;
  } else {
    let errorMessage;
    switch (response.status) {
      case 403:
        errorMessage =
          "An error occurred while deleting existing Slack alerts.";
        break;
      case 500:
        errorMessage =
          "Internal server error. Please try again later or contact us.";
        break;
      default:
        errorMessage = "An unknown error occurred. Please try again later.";
    }
    onError("Unable to Uninstall Slack", errorMessage, "error");
    return false;
  }
}
