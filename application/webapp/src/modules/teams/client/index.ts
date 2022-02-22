import useSWR from "swr";
import { Team } from "utils";
import { env } from "../../../common/client-utils";
import { TeamCreationInputs } from "../../../common/components/New-Team-Dialog";

export const teamsApiUrl = env.BASE_URL + "api/teams";

export const teamFetch = (url: string, team: string | undefined) => {
  const urlWithParams = url + (team ? "?teamId=" + team : "");
  return fetch(urlWithParams, { method: "GET" }).then((r) => r.json());
};

export const useTeam = (teamId: string) => {
  const { data, error, mutate } = useSWR(
    teamId !== undefined || teamId !== "" ? [teamsApiUrl, teamId] : null,
    teamFetch,
    { shouldRetryOnError: false }
  );

  return {
    team: data as Team,
    teamIsLoading: !error && !data,
    teamFetchError: error,
    mutateTeams: mutate,
  };
};

export const checkTeamExists = async (id: string) => {
  const urlWithParams = teamsApiUrl + (id ? "?teamId=" + id : "");
  try {
    const res: Response = await fetch(urlWithParams);
    return res.status === 403 || res.status === 200;
  } catch (err) {
    console.log(err);
  }
};

export const createTeam = async ({
  id,
  plan,
  onSuccess,
  onError,
}: TeamCreationInputs & {
  onSuccess: (plan: string, id: string) => Promise<void>;
  onError: (message: string) => void;
}) => {
  const response = await fetch(teamsApiUrl, {
    method: "POST",
    headers: {
      "Content-type": "application/json; charset=UTF-8",
    },
    body: JSON.stringify({ teamId: id }),
  });
  if (response.ok) {
    await onSuccess(plan, id);
  } else {
    let errorMessage;
    switch (response.status) {
      case 403:
        errorMessage = "You do not have permission to perform this action.";
        break;
      case 500:
        errorMessage = "Internal server error. Please try again later.";
        break;
      default:
        errorMessage = "An unknown error occurred. Please try again later.";
        break;
    }
    onError(errorMessage);
  }
};
