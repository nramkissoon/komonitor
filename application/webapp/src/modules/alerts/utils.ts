import {
  Alert,
  AlertInvocation,
  AlertTypes,
  EditableAlertAttributes,
} from "project-types";
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

export function createUpdatedAlert(alert: Alert) {
  const updatedAlert: Alert = { ...alert };
  updatedAlert.last_updated = new Date().getTime();
  return updatedAlert;
}

export function createAlertIdToInvocationArrayMap(
  ids: string[],
  invocations: AlertInvocation[]
) {
  const map: { [key: string]: AlertInvocation[] } = {};
  for (let id of ids) {
    if (!map[id]) {
      map[id] = [];
    }
  }
  for (let status of invocations) {
    const id = status.monitor_id;
    map[id].push(status);
  }
  return map;
}
