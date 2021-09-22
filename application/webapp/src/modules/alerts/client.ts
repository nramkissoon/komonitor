import useSWR from "swr";
import { Alert } from "types";
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

function createAlertEditableAttributesFromFormData(formData: any) {}

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

function createUpdatedAlertFromFormData(formData: any) {}

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
