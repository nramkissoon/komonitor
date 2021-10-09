import {
  CoreUptimeMonitor,
  UptimeCheckSupportedFrequenciesInMinutes,
  UptimeMonitor,
  UptimeMonitorStatus,
} from "project-types";
import useSWR from "swr";
import { env } from "../../common/client-utils";

export const monitorApiUrl = env.BASE_URL + "api/uptime/monitors";
export const statusApiUrl = env.BASE_URL + "api/uptime/statuses";

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
    const yesterday = 24 * 60 * 60 * 1000;
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
    statuses: data as { [monitorId: string]: UptimeMonitorStatus[] },
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
  onError?: (message: string) => void
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
    let errorMessage;
    switch (response.status) {
      case 403:
        errorMessage =
          "Monitor limit reached. Please consider deleting an existing monitor or upgrading your account.";
        break;
      case 400:
        errorMessage = "Invalid monitor attributes sent to server.";
      case 500:
        errorMessage = "Internal server error. Please try again later.";
      default:
        errorMessage = "An unknown error occurred. Please try again later.";
    }
    onError ? onError(errorMessage) : null;
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
  onError?: (message: string) => void
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
    let errorMessage;
    switch (response.status) {
      case 403:
        errorMessage = "Monitor does not belong to requester.";
        break;
      case 400:
        errorMessage = "Invalid monitor attributes sent to server.";
      case 500:
        errorMessage = "Internal server error. Please try again later.";
      default:
        errorMessage = "An unknown error occurred. Please try again later.";
    }
    onError ? onError(errorMessage) : null;
  }
}

export async function detachAlertFromUptimeMonitor(
  monitor: UptimeMonitor,
  alertId: string,
  onSuccess?: Function,
  onError?: (message: string) => void
) {
  // TODO update to multiple alerts when applicable
  if (monitor.alert_id !== alertId) return;
  monitor.alert_id = undefined;
  monitor.failures_before_alert = undefined;
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
    onError ? onError("An error occurred. Please try again later.") : null;
  }
}
