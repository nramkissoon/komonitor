import { NextApiRequest, NextApiResponse } from "next";
import { Session } from "next-auth";
import { getSession } from "next-auth/react";
import { env } from "../../../../src/common/server-utils";
import { slackInstaller } from "../../../../src/modules/integrations/slack/server";

async function getHandler(
  req: NextApiRequest,
  res: NextApiResponse,
  session: Session
) {
  try {
    const userId = session.uid as string;
    const url = await slackInstaller.generateInstallUrl(
      {
        scopes: ["incoming-webhook", "team:read", "channels:read"],
        redirectUri: env.SLACK_REDIRECT,
        metadata: userId, // pass in the userId in order to link the installation with the user object in DB in the callback
      },
      true
    );
    res.status(200);
    res.json({ url });
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
      default:
        res.status(405);
        break;
    }
  } else {
    res.status(401);
  }
  res.end();
}
