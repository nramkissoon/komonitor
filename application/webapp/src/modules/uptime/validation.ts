import { CoreUptimeMonitor, UptimeMonitor } from "types";
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
    typeof obj.retries === "number" &&
    isValidFrequency(obj.frequency, product_id) &&
    isValidName(obj.name) &&
    isValidUrl(obj.url) &&
    isValidRegion(obj.region) &&
    isValidRetries(obj.retries, product_id) &&
    isValidWebhookUrl(product_id, obj.webhook_url) &&
    isValidFailuresBeforeAlert(obj.failures_before_alert)
  );
}

export function isValidUptimeMonitor(
  obj: any,
  product_id: string
): obj is UptimeMonitor {
  return (
    typeof obj.owner_id === "string" &&
    typeof obj.name === "string" &&
    typeof obj.created_at === "number" &&
    typeof obj.last_updated === "number" &&
    isValidCoreUptimeMonitor(obj, product_id)
  );
}

export function isValidRegion(region: string) {
  return ["us-east-1"].includes(region);
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
  if (!failures) return true;
  return failures >= 1 && failures <= 5;
}

export function isValidRetries(retries: number, product_id: string) {
  if (product_id === PLAN_PRODUCT_IDS.FREE)
    return retries === 1 || retries === 0;
  return retries >= 0 && retries <= 5;
}
