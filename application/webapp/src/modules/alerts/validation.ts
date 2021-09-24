import { AlertTypes, EditableAlertAttributes } from "project-types";

export function isValidEditableAlertAttributesWithType(
  obj: any,
  product_id: string
): obj is EditableAlertAttributes & { type: AlertTypes } {
  return true;
}

function isValidName(name: string) {
  return name.length <= 50 && /^[a-zA-Z0-9-_]+$/i.test(name);
}

function isValidDescription(description: string) {}

function isValidSeverity(severity: string) {}

function isValidRecipients(recipients: string[]) {}

function isValidStatus(status: string) {}

function isValidType(type: string) {}
