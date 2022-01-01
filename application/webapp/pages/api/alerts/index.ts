import { NextApiRequest, NextApiResponse } from "next";
import { Session } from "next-auth";
import { getSession } from "next-auth/client";
import { ddbClient, env } from "../../../src/common/server-utils";
import {
  deleteAlert,
  getAlertForUserByAlertId,
  getAlertsForUser,
  putAlert,
} from "../../../src/modules/alerts/alert-db";
import {
  createNewAlertFromEditableAlertAttributesWithType,
  createUpdatedAlert,
} from "../../../src/modules/alerts/utils";
import {
  isValidAlert,
  isValidEditableAlertAttributesWithType,
} from "../../../src/modules/alerts/validation";
import { getAlertAllowanceFromProductId } from "../../../src/modules/billing/plans";
import { detachAlertFromMonitors } from "../../../src/modules/uptime/monitor-db";
import {
  getServicePlanProductIdForUser,
  getUserSubscriptionIsValid,
} from "../../../src/modules/user/user-db";

async function getHandler(
  req: NextApiRequest,
  res: NextApiResponse,
  session: Session
) {
  try {
    const userId = session.uid as string;
    const alerts = await getAlertsForUser(
      ddbClient,
      env.ALERT_TABLE_NAME,
      userId
    );
    res.status(200);
    res.json(alerts);
  } catch (err) {
    console.log(err);
    res.status(500);
  }
}

async function createHandler(
  req: NextApiRequest,
  res: NextApiResponse,
  session: Session
) {
  try {
    // check if user is allowed to create a new alert
    const userId = session.uid as string;
    const { productId, valid } = await getUserSubscriptionIsValid(
      ddbClient,
      env.USER_TABLE_NAME,
      userId
    );
    const allowance = getAlertAllowanceFromProductId(productId);
    const currentAlertTotal = (
      await getAlertsForUser(ddbClient, env.ALERT_TABLE_NAME, userId)
    ).length;

    if (allowance <= currentAlertTotal || !valid) {
      res.status(403);
      return;
    }

    // validate the new alert
    const alert = req.body;
    if (!alert || !isValidEditableAlertAttributesWithType(alert, productId)) {
      res.status(400);
      return;
    }

    const newAlert = createNewAlertFromEditableAlertAttributesWithType(
      alert,
      userId
    );
    const created = await putAlert(
      ddbClient,
      env.ALERT_TABLE_NAME,
      newAlert,
      false
    );
    if (created) {
      res.status(200);
      return;
    }
    res.status(500);
    return;
  } catch (err) {
    console.log(err);
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
    const { alertId } = req.query;
    if (!alertId) {
      res.status(400);
      return;
    }

    const userId = session.uid as string;
    // check if alert is attached to any monitors
    // TODO check for errors in fetching monitors
    const detached = detachAlertFromMonitors(
      ddbClient,
      env.UPTIME_MONITOR_TABLE_NAME,
      userId,
      alertId as string,
      env.ALERT_INVOCATION_TABLE_NAME
    );

    if (!detached) {
      res.status(403);
      return;
    }

    const deleted = await deleteAlert(
      ddbClient,
      env.ALERT_TABLE_NAME,
      alertId as string,
      userId
    );
    deleted ? res.status(200) : res.status(500);
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
    const userId = session.uid as string;
    const productId = await getServicePlanProductIdForUser(
      ddbClient,
      env.USER_TABLE_NAME,
      userId
    );
    const alert = req.body;
    if (!alert || !isValidAlert(alert, productId)) {
      res.status(400);
      return;
    }

    // verify that the alert id belongs to the user before updating
    const alertExistsForUser = await getAlertForUserByAlertId(
      ddbClient,
      env.ALERT_TABLE_NAME,
      userId,
      alert.alert_id
    );
    // check created_at and owner_id as a extra check against tampering with the request
    if (
      alertExistsForUser === null ||
      alertExistsForUser?.created_at !== alert.created_at ||
      alertExistsForUser.alert_id !== alert.alert_id
    ) {
      res.status(403);
      return;
    }

    const updatedAlert = createUpdatedAlert(alert);
    const updated = await putAlert(
      ddbClient,
      env.ALERT_TABLE_NAME,
      updatedAlert,
      true
    );
    if (updated) {
      res.status(200);
      return;
    }
    res.status(500);
    return;
  } catch (err) {
    console.log(err);
    res.status(500);
    return;
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
