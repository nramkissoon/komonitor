export enum AlertTypes {
  Email = "Email",
  Slack = "Slack",
}

export enum AlertSeverities {
  Warning = "Warning",
  Severe = "Severe",
  Critical = "Critical",
}

export enum AlertStatuses {
  On = "on",
  Paused = "paused",
}

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
