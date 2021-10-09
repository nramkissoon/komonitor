import { MonitorTypes } from "src";

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
  monitor_id: string;
  monitor_type: MonitorTypes; // used to determine how to read the monitor field
  monitor: any;
}
