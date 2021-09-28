import {
  Alert,
  AlertInvocation,
  AlertSeverities,
  AlertTypes,
  EditableAlertAttributes,
} from "project-types";
import useSWR from "swr";
import { env } from "../../common/client-utils";

const alertApiUrl = env.BASE_URL + "/api/alerts";
const invocationApiUrl = env.BASE_URL + "/api/alerts/invocations";

export function useAlerts() {
  const fetcher = (url: string) =>
    fetch(url, { method: "GET" }).then((r) => r.json());
  const { data, error } = useSWR(alertApiUrl, fetcher, {
    errorRetryInterval: 10000,
  });

  return {
    alerts: data as Alert[],
    isLoading: !error && !data,
    isError: error,
  };
}

export function use24HourAlertInvocations(alertIds: string[]) {
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
    alertIds.length > 0 // determines if we should call the API
      ? [invocationApiUrl, ...alertIds]
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
  onError?: () => void
) {
  const response = await fetch(alertApiUrl + `?alertId=${alertId}`, {
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

function createAlertEditableAttributesFromFormData(formData: any) {
  const alertEditableAttributesWithType: EditableAlertAttributes & {
    type: string;
  } = {
    name: formData.name,
    description: formData.description,
    severity: formData.severity as AlertSeverities,
    recipients: formData.recipients,
    state: "enabled",
    type: formData.type as AlertTypes,
  };
  return alertEditableAttributesWithType;
}

export async function createAlert(
  formData: any,
  onSuccess?: () => void,
  onError?: (message: string) => void
) {
  const alert = createAlertEditableAttributesFromFormData(formData);
  const response = await fetch(alertApiUrl, {
    method: "POST",
    headers: {
      "Content-type": "application/json; charset=UTF-8",
    },
    body: JSON.stringify(alert),
  });
  if (response.ok) {
    onSuccess ? onSuccess() : null;
  } else {
    let errorMessage;
    switch (response.status) {
      case 403:
        errorMessage =
          "Alert limit reached. Please consider deleting an existing alert or upgrading your account.";
        break;
      case 400:
        errorMessage = "Invalid alert attributes sent to server.";
      case 500:
        errorMessage = "Internal server error. Please try again later.";
      default:
        errorMessage = "An unknown error occurred. Please try again later.";
    }
    onError ? onError(errorMessage) : null;
  }
}

function createUpdatedAlertFromFormData(formData: any) {
  const alert = {
    ...createAlertEditableAttributesFromFormData(formData),
    owner_id: formData.owner_id,
    alert_id: formData.alert_id,
    last_updated: Number.parseInt(formData.last_updated),
    created_at: Number.parseInt(formData.created_at),
  } as Alert;
  return alert;
}

export async function updateAlert(
  formData: any,
  onSuccess?: () => void,
  onError?: (message: string) => void
) {
  const alert = createUpdatedAlertFromFormData(formData);
  const response = await fetch(alertApiUrl, {
    method: "PUT",
    headers: {
      "Content-type": "application/json; charset=UTF-8",
    },
    body: JSON.stringify(alert),
  });
  if (response.ok) {
    onSuccess ? onSuccess() : null;
  } else {
    let errorMessage;
    switch (response.status) {
      case 403:
        errorMessage = "Alert does not belong to requester.";
        break;
      case 400:
        errorMessage = "Invalid alert attributes sent to server.";
      case 500:
        errorMessage = "Internal server error. Please try again later.";
      default:
        errorMessage = "An unknown error occurred. Please try again later.";
    }
    onError ? onError(errorMessage) : null;
  }
}
