import { Client } from "discord.js";
import { GetServerSideProps } from "next";
import url from "url";
import {
  DiscordWebhookAccessToken,
  DiscordWebhookIntegration,
  Team,
  User,
} from "utils";
import { env as clientEnv } from "../../../src/common/client-utils";
import { ddbClient, decrypt, env } from "../../../src/common/server-utils";
import {
  addTeamIntegration,
  getTeamById,
} from "../../../src/modules/teams/server/db";
import {
  addUserIntegration,
  getUserById,
} from "../../../src/modules/user/user-db";

export default function Callback() {
  return <></>; // this page contains no content and is just meant as a redirect
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const request = context.req;
  const response = context.res;

  const urlParts = url.parse(request.url ?? "", true);
  const { code, state } = urlParts.query;
  const props: any = { props: {} };
  const { id, isTeam } = JSON.parse(decrypt(state as string));

  try {
    // exchange code
    const API_ENDPOINT = "https://discord.com/api";
    const accessTokenResponse = await fetch(API_ENDPOINT + "/oauth2/token", {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      method: "POST",
      body: new URLSearchParams({
        client_id: env.DISCORD_CLIENT_ID,
        client_secret: env.DISCORD_CLIENT_SECRET,
        grant_type: "authorization_code",
        code: code as string,
        redirect_uri: env.BASE_URL + "integrations/discord/callback",
        scope: "webhook.incoming",
      }),
    });

    const webhookAccessToken =
      (await accessTokenResponse.json()) as DiscordWebhookAccessToken;
    const client = new Client();
    const login = await client.login(env.DISCORD_BOT_TOKEN);
    const guilds = await client.guilds;
    const channels = await client.channels;

    const guild = await guilds.fetch(webhookAccessToken.webhook.guild_id);
    const guildName = guild?.name;
    const newChannel = (
      await channels.fetch(webhookAccessToken.webhook.channel_id)
    ).toJSON();
    const channelName = (newChannel as any)["name"];

    const integration: DiscordWebhookIntegration = {
      access_token: webhookAccessToken.access_token,
      expires_in: webhookAccessToken.expires_in,
      refresh_token: webhookAccessToken.refresh_token,
      scope: webhookAccessToken.scope,
      token_type: webhookAccessToken.token_type,
      webhook: {
        ...webhookAccessToken.webhook,
        guildName: guildName as string,
        channelName: channelName as string,
      },
    };

    let owner;

    if (isTeam) {
      const team = await getTeamById(id);
      if (!team) {
        throw new Error("team does not exist");
      }
      owner = team;
    } else {
      const user = await getUserById(ddbClient, env.USER_TABLE_NAME, id);
      if (!user) {
        throw new Error("user does not exist");
      }
      owner = user;
    }

    // check if already installed
    const discordIntegrations = owner.integrations
      ? owner.integrations
          .filter((i) => i.type === "DiscordWebhook")
          .map((i) => i.data as DiscordWebhookIntegration)
      : [];

    let alreadyInstalled = false;
    for (let integ of discordIntegrations) {
      if (
        integ.webhook.channel_id === integration.webhook.channel_id &&
        integ.webhook.guild_id === integration.webhook.guild_id
      ) {
        alreadyInstalled = true;
      }
    }

    if (alreadyInstalled) {
      props.redirect = {
        permanent: false,
        destination:
          clientEnv.BASE_URL +
          `${
            isTeam ? "teams/" + id : "app"
          }/integrations?discordAlreadyInstalled=true`,
      };

      return props;
    }

    let saved = false;

    if (isTeam) {
      saved = await addTeamIntegration(owner as Team, {
        type: "DiscordWebhook",
        data: integration,
      });
    } else {
      saved = await addUserIntegration(owner as User, {
        type: "DiscordWebhook",
        data: integration,
      });
    }

    if (!saved) {
      throw new Error("failed to save discord integration");
    }

    props.redirect = {
      permanent: false,
      destination:
        clientEnv.BASE_URL +
        `${
          isTeam ? "teams/" + id : "app"
        }/integrations?discordIntegrationSuccess=true`,
    };

    return props;
  } catch (err) {
    console.log(err);
    props.redirect = {
      permanent: false,
      destination:
        clientEnv.BASE_URL +
        `${
          isTeam ? "teams/" + id : "app"
        }/integrations?discordIntegrationSuccess=false`,
    };
  }
  return props;
};
