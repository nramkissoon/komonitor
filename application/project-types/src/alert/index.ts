import { MonitorTypes } from "./../config";

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

export type NewAlertAttributes = EditableAlertAttributes & { type: AlertTypes };

export interface NonEditableAlertAttributes {
  owner_id: string;
  alert_id: string;
  created_at: number;
  last_updated: number;
}

export type Alert = NewAlertAttributes & NonEditableAlertAttributes;

export interface AlertInvocation {
  alert_id: string;
  alert: Alert; // Alert state at invocation
  timestamp: number;
  monitor_id_timestamp: string; // adding timestamp ensures unique sort key
  monitor_type: MonitorTypes; // used to determine how to read the monitor field
  monitor: any;
  statuses: {
    id: string;
    timestamp: number;
  }[];
  ongoing: boolean; // indicates if the alert is still ongoing (no up statuses since last invocation)
}
