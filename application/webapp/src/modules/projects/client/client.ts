import { useRouter } from "next/router";
import useSWR from "swr";
import { Project } from "utils";
import { env } from "../../../common/client-utils";

export const projectsApiUrl = env.BASE_URL + "api/projects";

const projectFetcher = (url: string, team: string | undefined) => {
  const urlWithParams = url + (team ? "?teamId=" + team : "");
  return fetch(urlWithParams, { method: "GET" }).then((r) => r.json());
};

export const useProjects = () => {
  // team determines what projects to get
  const router = useRouter();
  const { teamId } = router.query;
  const { data, error, mutate } = useSWR(
    [projectsApiUrl, teamId],
    projectFetcher
  );

  return {
    projects: data as Project[],
    projectsIsLoading: !error && !data,
    projectsFetchError: error,
    mutateProjects: mutate,
  };
};

export const deleteProject = async (
  projectId: string,
  onSuccess: () => void,
  onError: () => void
) => {
  const response = await fetch(projectsApiUrl + `?projectId=${projectId}`, {
    method: "DELETE",
  });
  if (response.ok) {
    onSuccess();
  } else {
    onError();
  }
};

export const createProject = async (
  formData: any,

  onSuccess?: () => void,
  onError?: (message: string) => void,
  teamId?: string
) => {
  const response = await fetch(
    projectsApiUrl + (teamId ? `?teamId=${teamId}` : ""),
    {
      method: "POST",
      headers: {
        "Content-type": "application/json; charset=UTF-8",
      },
      body: JSON.stringify(formData),
    }
  );
  if (response.ok) {
    onSuccess ? onSuccess() : null;
  } else {
    let errorMessage;
    switch (response.status) {
      case 403:
        errorMessage = "You do not have permission to perform this action.";
        break;
      case 400:
        errorMessage = "Invalid project attributes sent to server.";
        break;
      case 500:
        errorMessage = "Internal server error. Please try again later.";
        break;
      default:
        errorMessage = "An unknown error occurred. Please try again later.";
        break;
    }
    onError ? onError(errorMessage) : null;
  }
};

export const updateProject = async (
  formData: {
    updateType: keyof Project;
    newValue: unknown;
    originalId: string;
  },
  onSuccess?: () => void,
  onError?: (message: string) => void
) => {
  const response = await fetch(projectsApiUrl, {
    method: "PUT",
    headers: {
      "Content-type": "application/json; charset=UTF-8",
    },
    body: JSON.stringify(formData),
  });
  if (response.ok) {
    onSuccess ? onSuccess() : null;
  } else {
    let errorMessage;
    switch (response.status) {
      case 403:
        errorMessage = "You do not have permission to perform this action.";
        break;
      case 400:
        errorMessage = "Invalid project attributes sent to server.";
        break;
      case 500:
        errorMessage = "Internal server error. Please try again later.";
        break;
      default:
        errorMessage = "An unknown error occurred. Please try again later.";
        break;
    }
    onError ? onError(errorMessage) : null;
  }
};
