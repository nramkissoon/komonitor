export type AlertTypes = "Email" | "Slack";

export type AlertSeverities = "Warning" | "Severe" | "Critical";

export type AlertStatuses = "on" | "paused";

export interface EditableAlertAttributes {
  name: string;
  description: string;
  severity: AlertSeverities;
  recipients: string[];
  status: AlertStatuses;
}

export interface Alert extends EditableAlertAttributes {
  type: AlertTypes;
  owner_id: string;
  alert_id: string;
  created_at: number;
  last_updated: number;
}
