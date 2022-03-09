import { useRouter } from "next/router";
import { SlackInstallation } from "utils";
import { useTeam } from "../teams/client";
import { useUserSlackInstallations } from "../user/client";

export type Integrations = {
  data: SlackInstallation<"v1" | "v2", boolean> | undefined;
  type: "Slack";
  mutate: () => void;
}[];

export const useTeamIntegrations = () => {
  const { teamId } = useRouter().query;

  const { team, teamFetchError, teamIsLoading, mutateTeams } = useTeam(
    teamId as string
  );

  let integrations: Integrations = team
    ? team.integrations.map((i) => ({
        data: i.data,
        type: i.type,
        mutate: mutateTeams,
      }))
    : [];

  return {
    integrations,
    teamFetchError,
    teamIsLoading,
    mutateTeams,
  };
};

export function useUserIntegrations() {
  const { data, isError, mutate, isLoading } = useUserSlackInstallations();
  const slackIntegrations: Integrations = data
    ? data.map((integ) => ({ data: integ, type: "Slack", mutate: mutate }))
    : [];
  return {
    integrations: [...slackIntegrations] as Integrations,
    isError,
    isLoading,
    mutate: async () => {
      await mutate();
    },
  };
}

export function useIntegrations() {
  const { teamId } = useRouter().query;
  const { integrations, isError, isLoading, mutate } = useUserIntegrations();
  const {
    integrations: teamIntegrations,
    teamFetchError,
    teamIsLoading,
    mutateTeams,
  } = useTeamIntegrations();

  return {
    integrations: teamId ? teamIntegrations : integrations,
    isLoading: teamId ? teamIsLoading : isLoading,
    isError: teamId ? teamFetchError : isError,
    mutate: teamId ? mutateTeams : mutate,
  };
}
