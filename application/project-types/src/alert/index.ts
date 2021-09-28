export type AlertTypes = "Email" | "Slack";

export type AlertSeverities = "Warning" | "Severe" | "Critical";

export type AlertStates = "enabled" | "disabled";

export interface EditableAlertAttributes {
  name: string;
  description: string;
  severity: AlertSeverities;
  recipients: string[];
  state: AlertStates;
}

export interface Alert extends EditableAlertAttributes {
  type: AlertTypes;
  owner_id: string;
  alert_id: string;
  created_at: number;
  last_updated: number;
}

export interface AlertInvocation {
  alert_id: string;
  timestamp: number;
  monitor_id: string;
  recipients: string[];
}
