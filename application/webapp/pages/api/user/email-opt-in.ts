import { NextApiRequest, NextApiResponse } from "next";
import { Session } from "next-auth";
import { getSession } from "next-auth/react";
import { ddbClient, env } from "../../../src/common/server-utils";
import { setEmailOptInForUser } from "../../../src/modules/user/user-db";

async function postHandler(
  req: NextApiRequest,
  res: NextApiResponse,
  session: Session
) {
  try {
    const userId = session.uid as string;
    const body = req.body;
    if (body.optIn === undefined) throw new Error("no opt in choice");
    const updated = await setEmailOptInForUser(
      ddbClient,
      env.USER_TABLE_NAME,
      userId,
      body.optIn
    );
    if (updated) {
      res.status(200);
      return;
    }
    throw new Error("unable to update optin in status");
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
  const session = (await getSession({ req })) as Session;
  switch (req.method) {
    case "POST":
      await postHandler(req, res, session);
      break;
    default:
      res.status(405);
      break;
  }

  res.end();
}
