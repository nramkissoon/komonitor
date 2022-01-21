import { env } from "../../../common/client-utils";

export const projectsApiUrl = env.BASE_URL + "api/projects";

export const useProjects = (team: "personal" | string) => {};
