import { NextApiRequest, NextApiResponse } from "next";
import { Session } from "next-auth";
import { getSession } from "next-auth/react";

async function getHandler(
  req: NextApiRequest,
  res: NextApiResponse,
  session: Session
) {
  try {
    const userId = session.uid as string;

    const { incomingWebhookUrl } = req.body;

    if (!incomingWebhookUrl) throw new Error("no webhook url");

    const response = await fetch(incomingWebhookUrl, {
      method: "POST",
      headers: new Headers({ "content-type": "application/json" }),
      body: JSON.stringify({
        text: "[TEST ALERT]",
        attachments: [
          {
            color: "#E53E3E",
            blocks: [
              {
                type: "section",
                text: {
                  type: "mrkdwn",
                  text: "*<https://example.com|https://example.com>* is *DOWN*\n",
                },
              },
            ],
          },
        ],
      }),
    });

    if (!response.ok) throw new Error("test message response failed");
    res.status(200);
  } catch (err) {
    console.log(err);
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
      case "POST":
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
