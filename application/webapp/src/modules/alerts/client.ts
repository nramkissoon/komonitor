import { AlertInvocation } from "project-types";
import useSWR from "swr";
import { env } from "../../common/client-utils";

export const alertApiUrl = env.BASE_URL + "api/alerts";
export const invocationApiUrl = env.BASE_URL + "api/alerts/invocations";

export function useAlertInvocationsAllTime(monitorIds: string[]) {
  const fetcher = (url: string, ...ids: string[]) => {
    const allTime = Date.now();
    const urlWithParams =
      url + "?" + ids.map((id) => "id=" + id).join("&") + "&since=" + allTime;
    return fetch(urlWithParams, { method: "GET" }).then((r) => r.json());
  };

  const { data, error } = useSWR(
    monitorIds.length > 0 // determines if we should call the API
      ? [invocationApiUrl, ...monitorIds]
      : null,
    fetcher,
    {
      shouldRetryOnError: true,
      errorRetryInterval: 10000, // retry in 10 seconds
    }
  );

  return {
    invocations: data as { [alertId: string]: AlertInvocation[] },
    isLoading: !error && !data,
    isError: error,
  };
}
