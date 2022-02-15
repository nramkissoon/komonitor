import { AlertInvocation } from "utils";
import { v4 as uuidv4 } from "uuid";

function createAlertId() {
  return "alert-" + uuidv4();
}

export function createMonitorIdToInvocationArrayMap(
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
