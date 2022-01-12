import { Alert, AlertInvocation } from "project-types";
import useSWR from "swr";
import { env } from "../../common/client-utils";

export const alertApiUrl = env.BASE_URL + "api/alerts";
export const invocationApiUrl = env.BASE_URL + "api/alerts/invocations";

export function useAlerts() {
  const fetcher = (url: string) =>
    fetch(url, { method: "GET" }).then((r) => r.json());
  const { data, error } = useSWR(alertApiUrl, fetcher);

  return {
    alerts: data as Alert[],
    isLoading: !error && !data,
    isError: error,
  };
}

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

export async function deleteAlert(
  alertId: string,
  onSuccess?: () => void,
  onError?: (msg: string) => void
) {
  const response = await fetch(alertApiUrl + `?alertId=${alertId}`, {
    method: "DELETE",
  });
  if (response.ok) {
    onSuccess ? onSuccess() : null;
    return true;
  } else {
    let errorMessage;
    switch (response.status) {
      case 403:
        errorMessage = `Unable to detach monitors, please try again later or manually detach monitors.`;
        break;
      case 400:
        errorMessage = "Invalid request sent to server.";
      case 500:
        errorMessage = "Internal server error. Please try again later.";
      default:
        errorMessage = "An unknown error occurred. Please try again later.";
    }
    onError ? onError(errorMessage) : null;
  }
}
