import { NextApiRequest, NextApiResponse } from "next";
import { Session } from "next-auth";
import { getSession } from "next-auth/client";
import spacetime from "spacetime";
import { ddbClient, env } from "../../../src/common/server-utils";
import { allTimezones } from "../../../src/common/utils";
import {
  getTimezonePreferenceForUser,
  setTimezonePreferenceForUser,
} from "../../../src/modules/user/user-db";
async function getHandler(
  req: NextApiRequest,
  res: NextApiResponse,
  session: Session
) {
  try {
    const userId = session.uid as string;
    const tz = await getTimezonePreferenceForUser(
      ddbClient,
      env.USER_TABLE_NAME,
      userId
    );

    const now = spacetime.now(tz);
    const offset = now.timezone().current.offset;
    const response = { tz: tz, offset: offset };

    res.status(200);
    res.json(response);
  } catch (err) {
    res.status(500);
    return;
  }
}

async function postHandler(
  req: NextApiRequest,
  res: NextApiResponse,
  session: Session
) {
  try {
    const userId = session.uid as string;
    const timezone = req.body;

    console.log(timezone);

    if (!Object.keys(allTimezones).includes(timezone)) {
      res.status(400);
      return;
    }

    const updated = await setTimezonePreferenceForUser(
      ddbClient,
      env.USER_TABLE_NAME,
      userId,
      timezone
    );

    res.status(200);
  } catch (err) {
    res.status(500);
    return;
  }
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = (await getSession({ req })) as Session;
  switch (req.method) {
    case "GET":
      await getHandler(req, res, session);
      break;
    case "POST":
      await postHandler(req, res, session);
      break;
    default:
      res.status(405);
      break;
  }

  res.end();
}
