import { CoreUptimeMonitor, UptimeMonitor } from "types";

export function isValidCoreUptimeMonitor(obj: any): obj is CoreUptimeMonitor {
  return (
    typeof obj.url === "string" &&
    typeof obj.name === "string" &&
    typeof obj.region === "string" &&
    typeof obj.frequency === "number" &&
    typeof obj.retries === "number" &&
    isValidFrequency(obj.frequency) &&
    isValidName(obj.name) &&
    isValidUrl(obj.url) &&
    isValidRegion(obj.region)
  );
}

export function isValidUptimeMonitor(obj: any): obj is UptimeMonitor {
  return (
    typeof obj.owner_id === "string" &&
    typeof obj.name === "string" &&
    typeof obj.created_at === "number" &&
    typeof obj.last_updated === "number" &&
    isValidCoreUptimeMonitor(obj)
  );
}

export function isValidRegion(region: string) {
  return ["us-east-1"].includes(region);
}

export function isValidFrequency(freq: number) {
  return [1, 5, 15, 30, 60, 180, 360, 720, 1440].includes(freq);
}

export function isValidName(name: string) {
  return name.length <= 50 && /^[a-z0-9]+$/i.test(name);
}

export function isValidUrl(url: string) {
  return (
    url.length <= 250 &&
    (url.startsWith("https://") || url.startsWith("http://"))
  );
}
