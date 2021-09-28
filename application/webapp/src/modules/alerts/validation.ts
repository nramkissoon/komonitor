import {
  Alert,
  AlertSeverities,
  AlertStates,
  AlertTypes,
  EditableAlertAttributes,
} from "project-types";
import { getAlertRecipientLimitFromProductId } from "../billing/plans";

export function isValidEditableAlertAttributesWithType(
  obj: any,
  productId: string
): obj is EditableAlertAttributes & { type: AlertTypes } {
  return (
    typeof obj.type === "string" &&
    typeof obj.name === "string" &&
    typeof obj.description === "string" &&
    typeof obj.severity === "string" &&
    typeof obj.state === "string" &&
    isValidName(obj.name) &&
    isValidDescription(obj.description) &&
    isValidRecipients(obj.recipients, productId) &&
    isValidSeverity(obj.severity) &&
    isValidState(obj.state) &&
    isValidType(obj.type)
  );
}

export function isValidAlert(obj: any, productId: string): obj is Alert {
  return (
    typeof obj.owner_id === "string" &&
    typeof obj.created_at === "number" &&
    typeof obj.last_updated === "number" &&
    typeof obj.alert_id === "string" &&
    isValidEditableAlertAttributesWithType(obj, productId)
  );
}

function isValidName(name: string) {
  return name.length <= 50 && /^[a-zA-Z0-9-_]+$/i.test(name);
}

function isValidDescription(description: string) {
  return description.length <= 300;
}

function isValidSeverity(severity: string) {
  const validValues: AlertSeverities[] = ["Critical", "Warning", "Severe"];
  return validValues.includes(severity as AlertSeverities);
}

function isValidRecipients(recipients: string[], productId: string) {
  const limit = getAlertRecipientLimitFromProductId(productId);
  for (let recip of recipients) {
    if (recip.length > 100 || recip.length <= 0) return false;
  }
  return recipients.length <= limit;
}

function isValidState(state: string) {
  const validValues: AlertStates[] = ["disabled", "enabled"];
  return validValues.includes(state as AlertStates);
}

function isValidType(type: string) {
  const validValues: AlertTypes[] = ["Email", "Slack"];
  return validValues.includes(type as AlertTypes);
}
