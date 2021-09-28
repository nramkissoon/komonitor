import { Alert, AlertTypes, EditableAlertAttributes } from "project-types";
import { v4 as uuidv4 } from "uuid";

function createAlertId() {
  return "alert-" + uuidv4();
}

export function createNewAlertFromEditableAlertAttributesWithType(
  alert: EditableAlertAttributes & { type: AlertTypes },
  userId: string
): Alert {
  const now = new Date().getTime();
  return {
    owner_id: userId,
    alert_id: createAlertId(),
    created_at: now,
    last_updated: now,
    name: alert.name,
    description: alert.description,
    type: alert.type,
    state: alert.state,
    severity: alert.severity,
    recipients: alert.recipients,
  };
}
