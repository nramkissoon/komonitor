import useSWR from "swr";
import {
  CoreUptimeMonitor,
  UptimeCheckSupportedFrequenciesInMinutes,
  UptimeMonitor,
  UptimeMonitorStatus,
} from "types";
import { env } from "../../common/client-utils";

export const monitorApiUrl = env.BASE_URL + "/api/uptime/monitors";
export const statusApiUrl = env.BASE_URL + "/api/uptime/statuses";

const getFetcher = (url: string) =>
  fetch(url, { method: "GET" }).then((r) => r.json());

export function useUptimeMonitors() {
  const fetcher = getFetcher;
  const { data, error } = useSWR(monitorApiUrl, fetcher);
  return {
    monitors: data as UptimeMonitor[],
    isLoading: !error && !data,
    isError: error,
  };
}

// Used for the main uptime page, get status for all user monitors
export function use24HourMonitorStatuses(monitorIds: string[]) {
  const fetcher = (url: string, ...ids: string[]) => {
    const yesterday = new Date().getTime() - 24 * 60 * 60 * 1000;
    const urlWithParams =
      url +
      "?" +
      ids.map((id) => "id=" + id).join("&") +
      "&since=" +
      yesterday.toString();
    return fetch(urlWithParams, { method: "GET" }).then((r) => r.json());
  };
  const { data, error } = useSWR(
    monitorIds.length > 0 // determines if we should call the API
      ? [statusApiUrl, ...monitorIds]
      : null,
    fetcher,
    {
      shouldRetryOnError: true,
      errorRetryInterval: 10000, // retry in 10 seconds
    }
  );

  return {
    statuses: data as UptimeMonitorStatus[],
    isLoading: !error && !data,
    isError: error,
  };
}

export async function deleteMonitor(
  monitorId: string,
  onSuccess?: () => void,
  onError?: () => void
) {
  const response = await fetch(monitorApiUrl + `?monitorId=${monitorId}`, {
    method: "DELETE",
  });
  if (response.ok) {
    onSuccess ? onSuccess() : null;
    return true;
  } else {
    onError ? onError() : null;
    return false;
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
  const response = await fetch(monitorApiUrl, {
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

function createUpdatedMonitorFromFormData(formData: any) {
  const coreAttributes: CoreUptimeMonitor =
    createCoreMonitorFromFormData(formData);
  const monitor: UptimeMonitor = {
    monitor_id: formData.monitor_id,
    last_updated: Number.parseInt(formData.last_updated),
    created_at: Number.parseInt(formData.created_at),
    owner_id: formData.owner_id,
    ...coreAttributes,
  };
  return monitor;
}

export async function updateMonitor(
  formData: any,
  onSuccess?: () => void,
  onError?: () => void
) {
  const monitor = createUpdatedMonitorFromFormData(formData);
  const response = await fetch(monitorApiUrl, {
    method: "PUT",
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
