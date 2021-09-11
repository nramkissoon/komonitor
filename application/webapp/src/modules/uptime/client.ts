import useSWR from "swr";
import { UptimeMonitor } from "types";

const apiUrl = "/api/uptime/monitors";

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
  onOpenSuccess?: () => void,
  onOpenError?: () => void
) {
  const response = await fetch(apiUrl, {
    method: "DELETE",
    headers: {
      "Content-type": "application/json; charset=UTF-8",
    },
    body: JSON.stringify({ monitorId: monitorId }),
  });
  if (response.ok) {
    onOpenSuccess ? onOpenSuccess() : null;
  } else {
    onOpenError ? onOpenError() : null;
  }
}

export function createOrUpdateMonitor() {}
