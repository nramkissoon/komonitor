import { WebhookClient } from "discord.js";
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

    const { webhookId, webhookToken } = req.body;

    if (!webhookId || !webhookToken) {
      res.status(400);
      return;
    }

    const client = new WebhookClient(
      webhookId as string,
      webhookToken as string
    );

    const discordResponse = await client.send({
      content: "[TEST ALERT]",
      embeds: [
        {
          title: "https://example.com is DOWN",
          description:
            "If you see this test, your integration is working! 🎉 🎉 🎉 ",
          color: 0xe53e3e,
        },
      ],
    } as any); // as any because api is weird
    client.destroy();

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
