import useSWR from "swr";
import {
  CoreUptimeMonitor,
  UptimeCheckSupportedFrequenciesInMinutes,
  UptimeMonitor,
  UptimeMonitorStatus
} from "utils";
import { env } from "../../common/client-utils";
import { useProjects } from "../projects/client/client";
import { Inputs } from "./components/Create-Update-Form-Rewrite";
import { sevenDaysAgo, thirtyDaysAgo, yesterday } from "./utils";

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

export function useUptimeMonitorsForProject(projectId: string) {
  const fetcher = (url: string, projectId: string) => {
    const urlWithParams = url + "?" + "projectId=" + projectId;
    return fetch(urlWithParams, { method: "GET" }).then((r) => r.json());
  };

  const { data, error, mutate } = useSWR([monitorApiUrl, projectId], fetcher, {
    shouldRetryOnError: true,
    errorRetryInterval: 10000, // retry in 10 seconds
  });

  return {
    monitors: data as { [projectId: string]: UptimeMonitor[] },
    isLoading: !error && !data,
    isError: error,
    mutate: mutate,
  };
}

export function useUptimeMonitorsForMultipleProjects(projectIds: string[]) {
  const fetcher = (url: string, ...ids: string[]) => {
    const urlWithParams =
      url + "?" + ids.map((id) => "projectId=" + id).join("&");
    return fetch(urlWithParams, { method: "GET" }).then((r) => r.json());
  };

  const { data, error, mutate } = useSWR(
    [monitorApiUrl, ...projectIds],
    fetcher,
    {
      shouldRetryOnError: true,
      errorRetryInterval: 10000, // retry in 10 seconds
    }
  );

  return {
    monitors: data as { [projectId: string]: UptimeMonitor[] },
    isLoading: !error && !data,
    isError: error,
    mutate: mutate,
  };
}

// Used for the main uptime page, get status for all user monitors
export function use24HourMonitorStatuses(monitorIds: string[]) {
  const fetcher = (url: string, ...ids: string[]) => {
    const urlWithParams =
      url + "?" + ids.map((id) => "id=" + id).join("&") + "&since=" + yesterday;
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
    statuses: (data as { [monitorId: string]: UptimeMonitorStatus[] }) ?? {},
    isLoading: !error && !data,
    isError: error,
  };
}

export const useMonitorsAnd24HrStatusesForProject = (projectId: string) => {
  const {
    monitors,
    isError: isErrorMonitors,
    isLoading: isLoadingMonitors,
  } = useUptimeMonitorsForProject(projectId);
  const {
    statuses,
    isLoading: isLoadingStatuses,
    isError: isErrorStatuses,
  } = use24HourMonitorStatuses(
    monitors[projectId]
      ? monitors[projectId].map((monitor) => monitor.monitor_id)
      : []
  );

  return {
    monitors,
    statuses,
    isLoading: isLoadingMonitors || isLoadingStatuses,
    isError: isErrorMonitors || isErrorStatuses,
  };
};

export const useMonitorsAnd24HrStatusesForAllOwnerProjects = () => {
  const { projects } = useProjects();
  const {
    monitors,
    isError: isErrorMonitors,
    isLoading: isLoadingMonitors,
  } = useUptimeMonitorsForMultipleProjects(
    projects ? projects.map((p) => p.project_id) : []
  );

  const monitorIds: string[] = [];
  if (monitors) {
    for (let projectId of Object.keys(monitors)) {
      if (Array.isArray(monitors[projectId])) {
        monitorIds.push(...monitors[projectId].map((m) => m.monitor_id));
      }
    }
  }

  const {
    statuses,
    isLoading: isLoadingStatuses,
    isError: isErrorStatuses,
  } = use24HourMonitorStatuses(monitorIds);

  return {
    monitors,
    statuses,
    isLoadingMonitors,
    isLoadingStatuses,
    isErrorMonitors,
    isErrorStatuses,
  };
};

// This function and the 30 day version is used for specific monitor views
export function use7DayMonitorStatuses(monitorId: string) {
  const fetcher = (url: string, ...ids: string[]) => {
    const urlWithParams =
      url +
      "?" +
      ids.map((id) => "id=" + id).join("&") +
      "&since=" +
      sevenDaysAgo;
    return fetch(urlWithParams, { method: "GET" }).then((r) => r.json());
  };
  const { data, error } = useSWR([statusApiUrl, monitorId], fetcher, {
    shouldRetryOnError: true,
    errorRetryInterval: 10000, // retry in 10 seconds
  });

  return {
    statuses: data as { [monitorId: string]: UptimeMonitorStatus[] },
    isLoading: !error && !data,
    isError: error,
  };
}

export function use30DayMonitorStatuses(monitorId: string) {
  const fetcher = (url: string, ...ids: string[]) => {
    const urlWithParams =
      url +
      "?" +
      ids.map((id) => "id=" + id).join("&") +
      "&since=" +
      thirtyDaysAgo;
    return fetch(urlWithParams, { method: "GET" }).then((r) => r.json());
  };
  const { data, error } = useSWR([statusApiUrl, monitorId], fetcher, {
    shouldRetryOnError: true,
    errorRetryInterval: 10000, // retry in 10 seconds
  });

  return {
    statuses: data as { [monitorId: string]: UptimeMonitorStatus[] },
    isLoading: !error && !data,
    isError: error,
  };
}

// wrapper function to be able to programmatically input how much time from now
export function useMonitorStatusHistory(monitorId: string, since: number) {
  const fetcher = (url: string, ...ids: string[]) => {
    const urlWithParams =
      url + "?" + ids.map((id) => "id=" + id).join("&") + "&since=" + since;
    return fetch(urlWithParams, { method: "GET" }).then((r) => r.json());
  };

  const { data, error } = useSWR([statusApiUrl, monitorId, since], fetcher, {
    shouldRetryOnError: true,
    errorRetryInterval: 10000, // retry in 10 seconds
  });

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

function createCoreMonitorFromFormData(formData: Inputs) {
  const form_http_headers: { header?: string; value?: string }[] =
    formData.http_parameters.headers ?? [];

  let headers: { [header: string]: string } = {};
  form_http_headers.forEach((header) => {
    if (
      header.header &&
      header.value &&
      header.header.length > 0 &&
      header.value.length > 0
    ) {
      headers[header.header] = header.value;
    }
  });

  const handleWebhookAlertUrl = (inputs: Inputs) => {
    if (inputs.alert && inputs.alert.recipients.Webhook !== undefined) {
      return ["https://" + inputs.alert.recipients.Webhook[0]];
    }
    return undefined;
  };

  const monitor: CoreUptimeMonitor = {
    url: "https://" + formData.url,
    name: formData.name,
    region: formData.region,
    project_id: formData.project_id,
    frequency: Number.parseInt(
      formData.frequency
    ) as UptimeCheckSupportedFrequenciesInMinutes,
    webhook_url: formData.webhook_url ? "https://" + formData.webhook_url : "",
    failures_before_alert: formData.alert
      ? formData.failures_before_alert
      : undefined,
    alert: formData.alert
      ? {
          channels: formData.alert?.channels ?? [],
          recipients: {
            Email: formData.alert?.recipients.Email ?? undefined,
            Slack: formData.alert?.recipients.Slack ?? undefined,
            Webhook: handleWebhookAlertUrl(formData),
          },
          description: formData.alert?.description ?? "",
        }
      : undefined,
    http_parameters: {
      method: formData.http_parameters.method,
      headers: Object.keys(headers).length > 0 ? headers : undefined,
      body:
        formData.http_parameters.body?.length > 0
          ? formData.http_parameters.body
          : undefined,
      follow_redirects: formData.http_parameters.follow_redirects,
    },
    up_condition_checks: formData.up_condition_checks,
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

export async function togglePauseMonitor(
  monitor: UptimeMonitor,
  onSuccess?: () => void,
  onError?: (message: string) => void
) {
  if (monitor.paused === undefined) {
    monitor.paused = true;
  } else {
    monitor.paused = !monitor.paused;
  }

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

// ⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⣀⣤⣤⣤⣀⣀⣀⣀⡀⠀⠀⠀⠀⠀⠀⠀
// ⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⣼⠟⠉⠉⠉⠉⠉⠉⠉⠙⠻⢶⣄⠀⠀⠀⠀⠀
// ⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣾⡏⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠙⣷⡀⠀⠀⠀
// ⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣸⡟⠀⣠⣶⠛⠛⠛⠛⠛⠛⠳⣦⡀⠀⠘⣿⡄⠀⠀
// ⠀⠀⠀⠀⠀⠀⠀⠀⠀⢠⣿⠁⠀⢹⣿⣦⣀⣀⣀⣀⣀⣠⣼⡇⠀⠀⠸⣷⠀⠀
// ⠀⠀⠀⠀⠀⠀⠀⠀⠀⣼⡏⠀⠀⠀⠉⠛⠿⠿⠿⠿⠛⠋⠁⠀⠀⠀⠀⣿⡄⣠
// ⠀⠀⢀⣀⣀⣀⠀⠀⢠⣿⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢻⡇⠀
// ⠿⠿⠟⠛⠛⠉⠀⠀⣸⡇⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢸⡇⠀
// ⠀⠀⠀⠀⠀⠀⠀⠀⣿⠁⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢸⣧⠀
// ⠀⠀⠀⠀⠀⠀⠀⢸⡿⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠈⣿⠀
// ⠀⠀⠀⠀⠀⠀⠀⣾⡇⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣿⠀
// ⠀⠀⠀⠀⠀⠀⠀⣿⠃⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣿⠀
// ⠀⠀⠀⠀⠀⠀⢰⣿⠀⠀⠀⠀⣠⡶⠶⠿⠿⠿⠿⢷⣦⠀⠀⠀⠀⠀⠀⠀⣿⠀
// ⠀⠀⣀⣀⣀⠀⣸⡇⠀⠀⠀⠀⣿⡀⠀⠀⠀⠀⠀⠀⣿⡇⠀⠀⠀⠀⠀⠀⣿⠀
// ⣠⡿⠛⠛⠛⠛⠻⠀⠀⠀⠀⠀⢸⣇⠀⠀⠀⠀⠀⠀⣿⠇⠀⠀⠀⠀⠀⠀⣿⠀
// ⢻⣇⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⣼⡟⠀⠀⢀⣤⣤⣴⣿⠀⠀⠀⠀⠀⠀⠀⣿⠀
// ⠈⠙⢷⣶⣦⣤⣤⣤⣴⣶⣾⠿⠛⠁⢀⣶⡟⠉⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⡟⠀
// ⢷⣶⣤⣀⠉⠉⠉⠉⠉⠄⠀⠀⠀⠀⠈⣿⣆⡀⠀⠀⠀⠀⠀⠀⢀⣠⣴⡾⠃⠀
// ⠀⠈⠉⠛⠿⣶⣦⣄⣀⠀⠀⠀⠀⠀⠀⠈⠛⠻⢿⣿⣾⣿⡿⠿⠟⠋⠁⠀⠀
