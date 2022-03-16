import useSWR from "swr";
import { env } from "../../../common/client-utils";

export const discordApi = env.BASE_URL + "api/integrations/discord";

export const discordInstallUrlApi =
  env.BASE_URL + "api/integrations/discord/install-url";

export const discordInstallationTestApi =
  env.BASE_URL + "api/integrations/discord/test";

const getFetcher = (url: string) =>
  fetch(url, { method: "GET" }).then((r) => r.json());

export const getDiscordUrl = (teamId?: string) => {
  const fetcher = getFetcher;
  const { data, error } = useSWR(
    discordInstallUrlApi + (teamId ? "?teamId=" + teamId : ""),
    fetcher,
    {
      revalidateOnReconnect: true,
    }
  );
  return {
    url: data ? data.url : undefined,
    isLoading: !error && !data,
    isError: error,
  };
};

export async function testDiscordInstallation(
  webhookToken: string,
  webhookId: string
) {
  const response = await fetch(discordInstallationTestApi, {
    method: "POST",
    body: JSON.stringify({ webhookId, webhookToken }),
    headers: {
      "Content-type": "application/json; charset=UTF-8",
    },
  });
  return response.ok;
}

export const deleteDiscordIntegration = async ({
  guildId,
  channelId,
  teamId,
  onError,
  onSuccess,
}: {
  guildId: string;
  channelId: string;
  teamId?: string;
  onSuccess: () => void;
  onError: (message: string) => void;
}) => {
  const response = await fetch(discordApi, {
    method: "DELETE",
    headers: {
      "Content-type": "application/json; charset=UTF-8",
    },
    body: JSON.stringify({ guildId, channelId, teamId }),
  });
  if (response.ok) {
    onSuccess();
    return true;
  } else {
    let errorMessage;
    switch (response.status) {
      case 403:
        errorMessage =
          "An error occurred while deleting existing Discord alerts.";
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
