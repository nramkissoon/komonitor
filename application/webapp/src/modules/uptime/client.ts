import useSWR from "swr";
import {
  CoreUptimeMonitor,
  UptimeCheckSupportedFrequenciesInMinutes,
  UptimeMonitor,
} from "types";
import { env } from "../../common/client-utils";

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

function createCoreMonitorFromFormData(formData: any) {
  const monitor: CoreUptimeMonitor = {
    url: "https://" + formData.url,
    name: formData.name,
    region: formData.region,
    frequency: Number.parseInt(
      formData.frequency
    ) as UptimeCheckSupportedFrequenciesInMinutes,
    retries: Number.parseInt(formData.retries),
    webhook_url: formData.webhook ? "https://" + formData.webhook : "",
    failures_before_alert: formData.alert
      ? Number.parseInt(formData.failures_before_alert)
      : undefined,
    alert_id: formData.alert,
  };

  return monitor;
}

export async function createMonitor(
  formData: any,
  onSuccess?: () => void,
  onError?: () => void
) {
  const monitor = createCoreMonitorFromFormData(formData);
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

function createUpdatedMonitorFromFormData(formData: any) {}

export async function updateMonitor(formData: any) {}
