import useSWR from "swr";
import { Alert } from "types";
import { env } from "../../common/client-utils";

const apiUrl = env.BASE_URL + "/api/alerts";

export function useAlerts() {
  const fetcher = (url: string) =>
    fetch(url, { method: "GET" }).then((r) => r.json());
  const { data, error } = useSWR(apiUrl, fetcher);

  return {
    monitors: data as Alert[],
    isLoading: !error && !data,
    isError: error,
  };
}

export async function deleteAlert() {}

export async function createOrUpdateAlert() {}
