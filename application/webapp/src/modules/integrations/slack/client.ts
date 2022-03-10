import useSWR from "swr";
import { env } from "../../../common/client-utils";

export const slackInstallUrlApi =
  env.BASE_URL + "api/integrations/slack/install-url";

export const slackInstallationTestApi =
  env.BASE_URL + "api/integrations/slack/test";

export const slackInstallationApi = env.BASE_URL + "api/integrations/slack";

const getFetcher = (url: string) =>
  fetch(url, { method: "GET" }).then((r) => r.json());

export function useSlackInstallUrl(teamId?: string) {
  // use a custom install URL for every integration
  const fetcher = getFetcher;
  const { data, error } = useSWR(
    slackInstallUrlApi + (teamId ? "?teamId=" + teamId : ""),
    fetcher,
    {
      revalidateOnReconnect: true,
    }
  );
  return { url: data, isLoading: !error && !data, isError: error };
}

export async function testSlackInstallation(webhookUrl: string) {
  console.log(webhookUrl);
  const response = await fetch(slackInstallationTestApi, {
    method: "POST",
    body: JSON.stringify({ incomingWebhookUrl: webhookUrl }),
    headers: {
      "Content-type": "application/json; charset=UTF-8",
    },
  });
  return response.ok;
}

export const deleteSlackIntegration = async ({
  slackChannel,
  slackTeam,
  teamId,
  onError,
  onSuccess,
}: {
  slackChannel: string;
  slackTeam: string;
  teamId?: string;
  onSuccess: () => void;
  onError: (message: string) => void;
}) => {
  const response = await fetch(slackInstallationApi, {
    method: "DELETE",
    headers: {
      "Content-type": "application/json; charset=UTF-8",
    },
    body: JSON.stringify({ slackChannel, slackTeam, teamId }),
  });
  if (response.ok) {
    onSuccess();
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
    onError(errorMessage);
    return false;
  }
};
