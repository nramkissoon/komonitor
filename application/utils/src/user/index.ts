import { Installation } from "@slack/oauth";
import crypto from "crypto";
// DynamoDB model for a user

export { Installation as SlackInstallation } from "@slack/oauth";

export interface DiscordWebhookIntegration {
  token_type: string;
  access_token: string;
  scope: string;
  expires_in: number;
  refresh_token: string;
  webhook: {
    application_id: string;
    name: string;
    url: string;
    channel_id: string;
    token: string;
    type: number;
    avatar: any;
    guild_id: string;
    id: string;
  };
}

export interface WebhookSecret {
  value: string;
  created_at: number;
}

export interface NextAuthUserAttributes {
  pk: string;
  sk: string;
  id: string;
  type: "USER";
  name: string | undefined;
  email: string | undefined;

  image: string | undefined;
  username: unknown;
  emailVerified: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface StripeAttributes {
  customer_id?: string;
  subscription_id?: string;
  current_period_end?: number;
  subscription_status?: string;
  product_id?: string;
}

export interface SlackAttributes {
  slack_installations?: Installation[];
}

export interface User
  extends NextAuthUserAttributes,
    StripeAttributes,
    SlackAttributes {
  tz?: string; // timezone preference
  webhook_secret?: WebhookSecret;
  emailOptIn: boolean;
  teams?: string[];
  integrations?: UserIntegration[];
}

export type TeamPermissionLevel = "admin" | "edit" | "view";

export interface TeamMember {
  user_id: string;
  email: string;
  name?: string;
  permission_level: TeamPermissionLevel;
}

export interface TeamIntegration {
  type: "Slack" | "DiscordWebhook";
  data: Installation | DiscordWebhookIntegration;
}

export interface UserIntegration extends TeamIntegration {}

export interface TeamInvite {
  team_id_invite_code_composite_key: string;
  expiration: number;
  email: string;
  permission_level: TeamPermissionLevel;
}

export const createTeamIdInviteCodeCompositeKey = (teamId: string) => {
  const chars =
    "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz".repeat(5);
  const rand = crypto.randomBytes(32);
  let key = teamId + "#";
  for (let i = 0; i < rand.length; i++) {
    let decimal = rand[i];
    key += chars[decimal];
  }
  return key;
};

export const createNewInvite = (
  email: string,
  teamId: string,
  permission: TeamPermissionLevel
): TeamInvite => {
  const exp = new Date();
  exp.setDate(exp.getDate() + 7);
  return {
    team_id_invite_code_composite_key:
      createTeamIdInviteCodeCompositeKey(teamId),
    expiration: exp.getTime(),
    email: email,
    permission_level: permission,
  };
};

export interface Team
  extends Pick<NextAuthUserAttributes, "pk" | "sk" | "id">,
    StripeAttributes {
  type: "TEAM";
  members: TeamMember[];
  integrations: TeamIntegration[];
  webhook_secret?: WebhookSecret;
  invites: TeamInvite[];
}
