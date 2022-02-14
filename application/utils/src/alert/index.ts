export type ChannelType = "Email" | "Slack" | "Webhook";

export interface Alert {
  description: string;
  recipients: {
    Slack?: string[];
    Email?: string[];
    Webhook?: string[];
  };
  channels: ChannelType[];
}

export interface AlertInvocation {
  monitor_id: string;
  alert: Alert; // Alert state at invocation
  timestamp: number;
  monitor: any; // state of the monitor at invocation
  statuses: {
    id: string;
    timestamp: number;
  }[];
  ongoing: boolean; // indicates if the alert is still ongoing (no up statuses since last invocation)
}
