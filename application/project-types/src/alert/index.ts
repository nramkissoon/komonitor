export type ChannelType = "Email" | "Slack";

export type AlertSeverities = "Warning" | "Severe" | "Critical";

export type AlertStates = "enabled" | "disabled";

export interface Alert {
  description: string;
  recipients: string[];
  channels: ChannelType[];
  state: AlertStates;
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
