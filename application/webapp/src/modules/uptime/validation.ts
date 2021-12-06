import { CoreUptimeMonitor, UptimeMonitor } from "project-types";
import { REGIONS } from "../../common/server-utils";
import { PLAN_PRODUCT_IDS } from "../billing/plans";

export function isValidCoreUptimeMonitor(
  obj: any,
  product_id: string
): obj is CoreUptimeMonitor {
  return (
    typeof obj.url === "string" &&
    typeof obj.name === "string" &&
    typeof obj.region === "string" &&
    typeof obj.frequency === "number" &&
    isValidFrequency(obj.frequency, product_id) &&
    isValidName(obj.name) &&
    isValidUrl(obj.url) &&
    isValidRegion(obj.region) &&
    isValidWebhookUrl(product_id, obj.webhook_url) &&
    isValidFailuresBeforeAlert(obj.failures_before_alert) &&
    isValidHttpHeaders(obj.http_headers)
  );
}

export function isValidUptimeMonitor(
  obj: any,
  product_id: string
): obj is UptimeMonitor {
  return (
    typeof obj.owner_id === "string" &&
    typeof obj.created_at === "number" &&
    typeof obj.last_updated === "number" &&
    isValidCoreUptimeMonitor(obj, product_id)
  );
}

export function isValidRegion(region: string) {
  return REGIONS.includes(region);
}

export function isValidFrequency(freq: number, product_id: string) {
  if (product_id === PLAN_PRODUCT_IDS.FREE)
    return [5, 15, 30, 60, 180, 360, 720, 1440].includes(freq);
  return [1, 5, 15, 30, 60, 180, 360, 720, 1440].includes(freq);
}

export function isValidName(name: string) {
  return name.length <= 50 && /^[a-zA-Z0-9-_]+$/i.test(name);
}

export function isValidUrl(url: string) {
  return url.length <= 250 && url.startsWith("https://");
}

export function isValidWebhookUrl(product_id: string, url?: string) {
  if (!url) return true;
  if (product_id === PLAN_PRODUCT_IDS.FREE) return !url;
  return isValidUrl(url);
}

export function isValidFailuresBeforeAlert(failures?: number) {
  if (!failures && failures !== 0) return true;
  return failures >= 1 && failures <= 5;
}

export function isValidHttpHeaders(headers: { [key: string]: string }) {
  if (!headers) return true;
  let invalid =
    Object.keys(headers).find((val) => val.length > 100) ||
    Object.values(headers).find((val) => val.length > 200);

  return !invalid && Object.keys(headers).length <= 10;
}
