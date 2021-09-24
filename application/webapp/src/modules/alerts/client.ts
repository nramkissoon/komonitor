import {
  Alert,
  AlertSeverities,
  AlertTypes,
  EditableAlertAttributes,
} from "project-types";
import useSWR from "swr";
import { env } from "../../common/client-utils";

const apiUrl = env.BASE_URL + "/api/alerts";

export function useAlerts() {
  const fetcher = (url: string) =>
    fetch(url, { method: "GET" }).then((r) => r.json());
  const { data, error } = useSWR(apiUrl, fetcher, {
    errorRetryInterval: 10000,
  });

  return {
    alerts: data as Alert[],
    isLoading: !error && !data,
    isError: error,
  };
}

export async function deleteAlert(
  alertId: string,
  onSuccess?: () => void,
  onError?: () => void
) {
  const response = await fetch(apiUrl + `?alertId=${alertId}`, {
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
    status: "on",
    type: formData.type as AlertTypes,
  };
  return alertEditableAttributesWithType;
}

export async function createAlert(
  formData: any,
  onSuccess?: () => void,
  onError?: () => void
) {
  const alert = createAlertEditableAttributesFromFormData(formData);
  const response = await fetch(apiUrl, {
    method: "POST",
    headers: {
      "Content-type": "application/json; charset=UTF-8",
    },
    body: JSON.stringify(alert),
  });
  if (response.ok) {
    onSuccess ? onSuccess() : null;
  } else {
    onError ? onError() : null;
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

export async function updateLayoutMeasurement(
  formData: any,
  onSuccess?: () => void,
  onError?: () => void
) {
  const alert = createUpdatedAlertFromFormData(formData);
  const response = await fetch(apiUrl, {
    method: "PUT",
    headers: {
      "Content-type": "application/json; charset=UTF-8",
    },
    body: JSON.stringify(alert),
  });
  if (response.ok) {
    onSuccess ? onSuccess() : null;
  } else {
    onError ? onError() : null;
  }
}
