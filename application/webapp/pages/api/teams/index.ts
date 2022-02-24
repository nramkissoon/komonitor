import { WebClient } from "@slack/web-api";
import { NextApiRequest, NextApiResponse } from "next";
import { Session } from "next-auth";
import { getSession } from "next-auth/react";
import { SlackInstallation, Team } from "utils";
import { stripeClient } from "../../../src/common/server-utils";
import {
  createTeam,
  deleteTeamAndAssociatedAssets,
  deleteTeamById,
  getTeamById,
  updateTeamSlackInstallation,
  userIsAdmin,
  userIsMember,
} from "../../../src/modules/teams/server/db";
import { teamIdIsAvailable } from "../../../src/modules/teams/server/validation";

const updateSlackInstallations = async (KoTeam: Team) => {
  const slackInstallations = KoTeam.integrations
    .filter((i) => i.type === "Slack")
    .map((i) => i.data) as SlackInstallation[];

  for (let slackInstallation of slackInstallations) {
    if (slackInstallation) {
      const oldInstallation = JSON.parse(JSON.stringify(slackInstallation)); // needs to be a different reference
      const slackClient = new WebClient(slackInstallation.bot?.token);

      try {
        const team = await slackClient.team.info({
          team: slackInstallation.team?.id,
        });
        let channel;
        if (slackInstallation.incomingWebhook?.channelId) {
          channel = await slackClient.conversations.info({
            channel: slackInstallation.incomingWebhook?.channelId,
          });
        }

        const mustUpdate =
          slackInstallation.team?.name !== team.team?.name ||
          slackInstallation.incomingWebhook?.channel !== channel?.channel?.name;

        if (slackInstallation.team && team.team?.name)
          slackInstallation.team.name = team.team?.name;
        if (slackInstallation.incomingWebhook && channel?.channel?.name)
          slackInstallation.incomingWebhook.channel = channel?.channel?.name;

        if (mustUpdate) {
          await updateTeamSlackInstallation(
            oldInstallation,
            slackInstallation,
            KoTeam
          );
        }

        if (slackInstallation) slackInstallation!.incomingWebhook!.url = "";
      } catch (err) {
        console.log(err);
        console.log("updated team and channel check failed");
      }
    }
  }
};

async function getHandler(
  req: NextApiRequest,
  res: NextApiResponse,
  session: Session
) {
  try {
    const { teamId } = req.query;

    if (!teamId || teamId === "") {
      res.json(undefined);
      return;
    }

    let userId = session.uid as string;

    const team = await getTeamById(teamId as string);

    if (!team) {
      res.status(404);
      return;
    }

    if (!userIsMember(userId, team)) {
      res.status(403);
      return;
    }

    // ensures integrations are not stale
    if (req.headers["referer"]?.includes("/integrations")) {
      updateSlackInstallations(team);
    }

    res.status(200);
    res.json(team);
  } catch (err) {
    console.log(err);
    res.status(500);
  }
}

//TODO update?

async function createHandler(
  req: NextApiRequest,
  res: NextApiResponse,
  session: Session
) {
  try {
    const userId = session.uid as string;

    const { teamId } = req.body;

    if (!teamIdIsAvailable(teamId)) {
      res.status(400);
      return;
    }

    const created = await createTeam(teamId, userId);

    if (created) {
      res.status(200);
      return;
    }
    res.status(200);
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
    const userId = session.uid as string;

    const { teamId } = req.body;

    const team = await getTeamById(teamId as string);

    if (!team) {
      res.status(404);
      return;
    }

    if (!userIsAdmin(userId, team)) {
      res.status(403);
      return;
    }

    if (!team.subscription_id) {
      await deleteTeamAndAssociatedAssets(team.id);
    } else {
      // delete the subscription
      const stripeRes = await stripeClient.subscriptions.del(
        team.subscription_id,
        { prorate: true }
      );
      if (stripeRes.status === "canceled") {
        await deleteTeamById(team.id);
      }
    }

    res.status(200);
    return;
  } catch (err) {
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
      default:
        res.status(405);
        break;
    }
  } else {
    res.status(401);
  }
  res.end();
}
