import { ItemTypes } from "project-types";
import { PLAN_PRODUCT_IDS } from "../modules/billing/plans";

export function percentile(values: number[], perc: number) {
  values = values.filter((value) => value !== -1); // REQUIRED BECAUSE -1 REPRESENTS NO RESPONSE / FAILURE
  if (values.length === 0) return -1; // FROM FACEBOOK OUTAGE LOL
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

export function itemIdToDisplayStringInTableCell(id: string) {
  const type = ITEM_ID_PREFIXES_TO_ITEM_TYPE[getItemIdPrefix(id)];
  switch (type) {
    case "uptime-monitor":
      return "Uptime";
    case "lighthouse-monitor":
      return "Lighthouse";
    case "browser-monitor":
      return "browser";
    default:
      return "";
  }
}

export function getItemBaseUrlFromItemId(id: string) {
  const type = ITEM_ID_PREFIXES_TO_ITEM_TYPE[getItemIdPrefix(id)];
  switch (type) {
    case "uptime-monitor":
      return "/app/uptime/";
    case "lighthouse-monitor":
      return "/app/lighthouse/";
    case "browser-monitor":
      return "/app/browser/";
    default:
      return "/";
  }
}

export function convertSecondsTimeStampToMilliSeconds(timestamp: number) {
  return timestamp * 1000;
}

export function addThreeDaysToStripeTimeStamp(timestamp: number) {
  return timestamp + 3 * 24 * 60 * 60;
}

export function convertStripeTimestampToAppTimestampWithBuffer(
  timestamp: number
) {
  return convertSecondsTimeStampToMilliSeconds(
    addThreeDaysToStripeTimeStamp(timestamp)
  );
}

export function getDisplayStringFromPlanProductId(id: string) {
  switch (id) {
    case PLAN_PRODUCT_IDS.FREE:
      return "Free Plan";
    case PLAN_PRODUCT_IDS.FREELANCER:
      return "Freelancer Plan";
    case PLAN_PRODUCT_IDS.BUSINESS:
      return "Business Plan";
    default:
      return "";
  }
}
