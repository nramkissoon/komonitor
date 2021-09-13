import useSWR from "swr";
import { CoreUptimeMonitor, UptimeMonitor } from "types";
import { env } from "../../common/client.utils";

const apiUrl = env.BASE_URL + "/api/uptime/monitors";

export function useUptimeMonitors() {
  const fetcher = (url: string) =>
    fetch(url, { method: "GET" }).then((r) => r.json());
  const { data, error } = useSWR(apiUrl, fetcher);

  return {
    monitors: data as UptimeMonitor[],
    isLoading: !error && !data,
    isError: error,
  };
}

export async function deleteMonitor(
  monitorId: string,
  onSuccess?: () => void,
  onError?: () => void
) {
  const response = await fetch(apiUrl + `?monitorId=${monitorId}`, {
    method: "DELETE",
  });
  if (response.ok) {
    onSuccess ? onSuccess() : null;
  } else {
    onError ? onError() : null;
  }
}

export async function createOrUpdateMonitor(
  monitor: UptimeMonitor | CoreUptimeMonitor,
  onSuccess?: () => void,
  onError?: () => void
) {
  const response = await fetch(apiUrl, {
    method: "POST",
    headers: {
      "Content-type": "application/json; charset=UTF-8",
    },
    body: JSON.stringify(monitor),
  });
  if (response.ok) {
    onSuccess ? onSuccess() : null;
  } else {
    onError ? onError() : null;
  }
}
