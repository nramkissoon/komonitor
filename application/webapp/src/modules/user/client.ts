import router from "next/router";
import useSWR from "swr";
import { env } from "../../common/client-utils";

const userPlanApiUrl = env.BASE_URL + "api/user/plan";
const userApiUrl = env.BASE_URL + "api/user";

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

export async function deleteUser(onError: (message: string) => void) {
  const response = await fetch(userApiUrl, { method: "DELETE" });
  if (response.ok) {
    router.push("/");
  } else {
    let errorMessage;
    switch (response.status) {
      case 403:
        errorMessage =
          "You must cancel your subscription before deleting your account.";
        break;
      case 500:
        errorMessage =
          "Internal server error. Please try again later or contact us.";
        break;
      default:
        errorMessage = "An unknown error occurred. Please try again later.";
    }
    onError(errorMessage);
    return false;
  }
  return true;
}
