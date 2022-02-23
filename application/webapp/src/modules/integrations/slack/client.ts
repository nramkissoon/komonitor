import useSWR from "swr";
import { env } from "../../../common/client-utils";

export const slackInstallUrlApi =
  env.BASE_URL + "api/integrations/slack/install-url";

export const slackInstallationTestApi =
  env.BASE_URL + "api/integrations/slack/test";

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

export async function testSlackInstallation() {
  const response = await fetch(slackInstallationTestApi, { method: "GET" });
  return response.ok;
}
