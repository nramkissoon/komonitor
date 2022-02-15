import { Installation } from "@slack/oauth";
// DynamoDB model for a user

export { Installation as SlackInstallation } from "@slack/oauth";

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
}
