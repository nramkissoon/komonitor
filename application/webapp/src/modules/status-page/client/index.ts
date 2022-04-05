import { useRouter } from "next/router";
import useSWR from "swr";
import { env } from "../../../common/client-utils";

export const statusPageApiUrl = env.BASE_URL + "/api/status-pages";

export const useStatusPagesForOwner = () => {
  const { teamId } = useRouter().query;
  const fetcher = (url: string, teamId: string | undefined) => {
    const urlWithTeamId = teamId ? `${url}?teamId=${teamId}` : url;
    return fetch(urlWithTeamId, { method: "GET" }).then((res) => res.json());
  };

  const { data, error, mutate } = useSWR([statusPageApiUrl, teamId], fetcher);
};

export const useStatusPageByUuid = () => {};

export const useIncidentsByStatusPageId = () => {};
