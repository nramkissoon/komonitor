import { WebhookClient } from "discord.js";
import { NextApiRequest, NextApiResponse } from "next";
import { Session } from "next-auth";
import { getSession } from "next-auth/react";
import { DiscordWebhookIntegration, Team, User } from "utils";
import { ddbClient, env } from "../../../../src/common/server-utils";
import {
  deleteTeamDiscordIntegration,
  getTeamById,
  userCanEdit,
} from "../../../../src/modules/teams/server/db";
import {
  getMonitorsForOwner,
  putMonitor,
} from "../../../../src/modules/uptime/monitor-db";
import {
  deleteUserDiscordIntegration,
  getUserById,
} from "../../../../src/modules/user/user-db";

const getGuildChannelIdFromCompoundKey = (key: string) => {
  const array = key.split("#");
  if (array.length !== 2)
    throw new Error("invalid discord compound key on monitor");
  return {
    guild: array[0],
    channel: array[1],
  };
};

const detachMonitorsWithDiscordAlerts = async ({
  ownerId,
  discordChannel,
  discordGuild,
}: {
  ownerId: string;
  discordChannel: string;
  discordGuild: string;
}) => {
  const uptimeMonitors = await getMonitorsForOwner(
    ddbClient,
    env.UPTIME_MONITOR_TABLE_NAME,
    ownerId
  );
  const monitorsWithDiscordAlerts = uptimeMonitors
    ? uptimeMonitors.filter((monitor) => {
        if (monitor.alert) {
          for (let channel of monitor.alert.channels) {
            if (channel === "Discord") {
              const compoundKey = monitor.alert.recipients.Discord![0];
              const components = getGuildChannelIdFromCompoundKey(compoundKey);
              if (
                components.channel === discordChannel &&
                components.guild === discordGuild
              ) {
                return true;
              }
            }
          }
        }
        return false;
      })
    : [];

  const detachDiscordAlertFromMonitorPromises: Promise<boolean>[] = [];

  for (let monitor of monitorsWithDiscordAlerts) {
    if (monitor.alert) {
      monitor.alert.channels = monitor.alert.channels.filter(
        (channel) => channel !== "Discord"
      );
      monitor.alert.recipients.Slack = undefined;
      detachDiscordAlertFromMonitorPromises.push(
        putMonitor(ddbClient, env.UPTIME_MONITOR_TABLE_NAME, monitor, true)
      );
    }
  }

  let monitorsDetached = true;

  if (detachDiscordAlertFromMonitorPromises.length > 0) {
    monitorsDetached = (
      await Promise.all(detachDiscordAlertFromMonitorPromises)
    ).reduce((prev, next) => prev && next);
  }

  return monitorsDetached;
};

const getDiscordIntegrationsFromOwner = (owner: Team | User) => {
  return (
    owner.integrations
      ? owner.integrations
          .filter((i) => i.type === "DiscordWebhook")
          .map((i) => i.data)
      : []
  ) as DiscordWebhookIntegration[];
};

const deleteDiscordIntegration = async ({
  owner,
  isTeam,
  discordChannel,
  discordGuild,
  res,
}: {
  owner: Team | User;
  isTeam: boolean;
  discordChannel: string;
  discordGuild: string;
  res: NextApiResponse;
}) => {
  const discordIntegrations = getDiscordIntegrationsFromOwner(owner);
  if (discordIntegrations.length === 0)
    throw new Error("no discord installation to delete");

  if (
    !(await detachMonitorsWithDiscordAlerts({
      ownerId: owner.id,
      discordChannel,
      discordGuild,
    }))
  ) {
    res.status(403);
    return;
  }

  const webhooks = discordIntegrations.filter((i) => {
    return (
      i.webhook.channel_id === discordChannel &&
      i.webhook.guild_id === discordGuild
    );
  });
  if (webhooks.length === 0) {
    throw new Error("no discord installation to delete");
  }
  const webhook = webhooks[0];
  const client = new WebhookClient({
    token: webhook.webhook.token,
    id: webhook.webhook.id,
  });
  const discordResponse = await client.delete();
  client.destroy();

  let deleted = false;
  if (isTeam) {
    deleted = await deleteTeamDiscordIntegration({
      team: owner as Team,
      channelId: discordChannel,
      guildId: discordGuild,
    });
  } else {
    deleted = await deleteUserDiscordIntegration({
      user: owner as User,
      channelId: discordChannel,
      guildId: discordGuild,
    });
  }

  if (!deleted) {
    throw new Error("discord integration deletion failure");
  }

  res.status(200);
  return;
};

async function deleteHandler(
  req: NextApiRequest,
  res: NextApiResponse,
  session: Session
) {
  try {
    const { guildId, channelId, teamId } = req.body;
    if (!channelId || !guildId) {
      res.status(400);
      return;
    }

    const userId = session.uid as string;

    if (!teamId) {
      const user = await getUserById(ddbClient, env.USER_TABLE_NAME, userId);
      if (!user) {
        res.status(403);
        return;
      }
      return deleteDiscordIntegration({
        owner: user,
        isTeam: false,
        discordGuild: guildId as string,
        discordChannel: channelId as string,
        res,
      });
    }

    const team = await getTeamById(teamId);
    if (!team || !userCanEdit(userId, team)) {
      res.status(403);
      return;
    }

    return deleteDiscordIntegration({
      owner: team,
      isTeam: true,
      discordGuild: guildId as string,
      discordChannel: channelId as string,
      res,
    });
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
    case "DELETE":
      await deleteHandler(req, res, session);
      break;
    default:
      res.status(405);
      break;
  }

  res.end();
}
