import { NextApiRequest, NextApiResponse } from "next";
import { Session } from "next-auth";
import { getSession } from "next-auth/react";
import { Project } from "utils";
import { ddbClient, env } from "../../../src/common/server-utils";
import {
  getProjectAllowanceFromProductId,
  PLAN_PRODUCT_IDS,
} from "../../../src/modules/billing/plans";
import {
  createProject,
  deleteProject,
  deleteProjectAndAssociatedAssets,
  getProjectForOwnerByProjectId,
  getProjectsForOwner,
} from "../../../src/modules/projects/server/db";
import { transferMultipleMonitorsToProject } from "../../../src/modules/uptime/monitor-db";
import { getServicePlanProductIdForUser } from "../../../src/modules/user/user-db";

const getOwnerId = (req: NextApiRequest, session: Session) => {
  const userId = session.uid as string;
  const { team } = req.query;

  // if team is defined it should be taken over userId since we are working in a team
  const ownerId = team ? (team as string) : userId;

  if (ownerId === team) {
    // check if userId in team members
    // throw if not valid
  }
  return ownerId;
};

const verifyDeletePermission = (
  req: NextApiRequest,
  session: Session,
  project: Project
) => {
  const userId = session.uid as string;
  const { team } = req.query;

  const ownerId = team ? (team as string) : userId;

  if (ownerId === team) {
    // is team project
    // check if userId in team members and allowed to edit
    return true;
  } else {
    return project.owner_id === userId;
  }
};

const verifyEditPermission = (
  req: NextApiRequest,
  session: Session,
  project: Project
) => {
  const userId = session.uid as string;
  const { team } = req.query;

  const ownerId = team ? (team as string) : userId;

  if (ownerId === team) {
    // check if userId in team members and allowed to edit
    return true;
  } else {
    return project.owner_id === userId;
  }
};

const verifyCreatePermission = (req: NextApiRequest, session: Session) => {
  const userId = session.uid as string;
  const { team } = req.query;

  const ownerId = team ? (team as string) : userId;

  if (ownerId === team) {
    // check if userId in team members and allowed to edit
    return true;
  } else {
    // check plan limits, else project goes into personal account
    return true;
  }
};

const verifyProjectFromFormIsProject = (
  projectFromForm: any
): projectFromForm is Project => {
  const dummyProject: Project = {
    owner_id: "",
    project_id: "",
    created_at: 0,
    updated_at: 0,
    tags: [],
  };
  const keys = Object.keys(dummyProject);
  for (let key of keys) {
    if (!(key in projectFromForm)) {
      return false;
    }
  }
  // check there are no weird keys
  for (let key of Object.keys(projectFromForm)) {
    if (!(key in dummyProject)) {
      return false;
    }
  }
  return true;
};

const createProjectFromFormData = (
  project: Project,
  req: NextApiRequest,
  session: Session
) => {
  const now = new Date().getTime();
  project.created_at = now;
  project.updated_at = now;
  project.owner_id = getOwnerId(req, session);
  return project;
};

async function getHandler(
  req: NextApiRequest,
  res: NextApiResponse,
  session: Session
) {
  try {
    const ownerId = getOwnerId(req, session);
    const projects = await getProjectsForOwner(
      ddbClient,
      env.PROJECTS_TABLE_NAME,
      ownerId
    );

    res.status(200);
    res.json(projects);
  } catch (err) {
    res.status(500);
  }
}

async function updateHandler(
  req: NextApiRequest,
  res: NextApiResponse,
  session: Session
) {
  try {
    const formData = req.body as {
      updateType: keyof Project;
      newValue: unknown;
      originalId: string;
    };

    const ownerId = getOwnerId(req, session);
    const { originalId } = formData;
    const projectInDb = await getProjectForOwnerByProjectId(
      ddbClient,
      env.PROJECTS_TABLE_NAME,
      ownerId,
      originalId
    );

    if (!verifyEditPermission(req, session, projectInDb)) {
      res.status(403);
      return;
    }

    projectInDb.updated_at = new Date().getTime();

    let updated = false;
    // ensure no funny business happens
    switch (formData.updateType) {
      case "project_id":
        if (typeof formData.newValue !== "string") {
          console.log("HERE");
          res.status(400);
          return;
        }

        projectInDb.project_id = formData.newValue;
        updated = await createProject(
          ddbClient,
          env.PROJECTS_TABLE_NAME,
          projectInDb
        );
        updated =
          updated &&
          (await deleteProject(
            ddbClient,
            env.PROJECTS_TABLE_NAME,
            ownerId,
            originalId
          ));
        updated =
          updated &&
          (await transferMultipleMonitorsToProject(
            ddbClient,
            env.UPTIME_MONITOR_TABLE_NAME,
            originalId,
            ownerId,
            formData.newValue,
            env.UPTIME_MONITOR_TABLE_PID_GSI_NAME
          ));
        break;
      default:
        break;
    }

    if (updated) {
      res.status(200);
      return;
    }

    return;
  } catch (err) {
    console.log(err);
    res.status(500);
    return;
  }
}

async function createHandler(
  req: NextApiRequest,
  res: NextApiResponse,
  session: Session
) {
  try {
    const projectFromForm = req.body;
    if (!verifyCreatePermission(req, session)) {
      res.status(403);
      return;
    }

    const ownerId = getOwnerId(req, session);

    // TODO check this for teams
    const productId = await getServicePlanProductIdForUser(
      ddbClient,
      env.USER_TABLE_NAME,
      ownerId
    );

    if (productId === PLAN_PRODUCT_IDS.STARTER) {
      const projects = await getProjectsForOwner(
        ddbClient,
        env.PROJECTS_TABLE_NAME,
        ownerId
      );

      if (projects.length === getProjectAllowanceFromProductId(productId)) {
        res.status(403);
        return;
      }
    }

    if (!verifyProjectFromFormIsProject(projectFromForm)) {
      res.status(400);
      return;
    }

    const project = createProjectFromFormData(projectFromForm, req, session);
    const created = await createProject(
      ddbClient,
      env.PROJECTS_TABLE_NAME,
      project
    );
    if (created) {
      res.status(200);
      return;
    }
    return;
  } catch (err) {
    res.status(500);
    return;
  }
}

async function deleteHandler(
  req: NextApiRequest,
  res: NextApiResponse,
  session: Session
) {
  try {
    const ownerId = getOwnerId(req, session);
    const { projectId } = req.query;
    const projectInDb = await getProjectForOwnerByProjectId(
      ddbClient,
      env.PROJECTS_TABLE_NAME,
      ownerId,
      projectId as string
    );
    if (!verifyDeletePermission(req, session, projectInDb)) {
      res.status(403);
      return;
    }

    const deleted = await deleteProjectAndAssociatedAssets(
      ddbClient,
      env.PROJECTS_TABLE_NAME,
      env.UPTIME_MONITOR_TABLE_NAME,
      env.UPTIME_MONITOR_TABLE_PID_GSI_NAME,
      ownerId,
      projectId as string
    );
    if (deleted) {
      res.status(200);
      return;
    }
    return;
  } catch (err) {
    res.status(500);
  }
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await getSession({ req });
  if (session) {
    switch (req.method) {
      case "GET":
        await getHandler(req, res, session);
        break;
      case "POST":
        await createHandler(req, res, session);
        break;
      case "DELETE":
        await deleteHandler(req, res, session);
        break;
      case "PUT":
        await updateHandler(req, res, session);
        break;
      default:
        res.status(405);
        break;
    }
  } else {
    res.status(401);
  }
  res.end();
}
