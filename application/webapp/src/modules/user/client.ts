import useSWR from "swr";
import { env } from "../../common/client-utils";

const userPlanApiUrl = env.BASE_URL + "/api/user/plan";

export function useUserServicePlanProductId() {
  const fetcher = (url: string) =>
    fetch(url, { method: "GET" }).then((r) => r.json());
  const { data, error } = useSWR(userPlanApiUrl, fetcher);
  return {
    data: data,
    isLoading: !error && !data,
    isError: error,
  };
}
