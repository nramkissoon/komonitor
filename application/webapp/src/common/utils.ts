import { ItemTypes } from "project-types";

export function percentile(values: number[], perc: number) {
  values = values.filter((value) => value !== -1); // REQUIRED BECAUSE -1 REPRESENTS NO RESPONSE / FAILURE
  values.sort((a, b) => a - b);
  const index = Math.ceil((perc / 100) * values.length);
  return values.at(index - 1);
}

export const ITEM_ID_PREFIXES = {
  UPTIME: "up",
  ALERT: "alert",
  BROWSER: "bro",
  LIGHTHOUSE: "lh",
};

export const ITEM_ID_PREFIXES_TO_ITEM_TYPE: { [key: string]: ItemTypes } = {
  up: "uptime-monitor",
  alert: "alert",
  bro: "browser-monitor",
  lh: "lighthouse-monitor",
};

export function getItemIdPrefix(id: string) {
  return id.split("-")[0];
}
