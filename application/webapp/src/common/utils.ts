import { ItemTypes } from "utils";
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
    case PLAN_PRODUCT_IDS.STARTER:
      return "Starter Plan";
    case PLAN_PRODUCT_IDS.PRO:
      return "Pro Plan";
    case PLAN_PRODUCT_IDS.BUSINESS:
      return "Business Plan";
    default:
      return "";
  }
}

export const allTimezones = {
  "Pacific/Midway": "Midway Island, Samoa",
  "Pacific/Honolulu": "Hawaii",
  "America/Juneau": "Alaska",
  "America/Boise": "Mountain Time",
  "America/Dawson": "Dawson, Yukon",
  "America/Chihuahua": "Chihuahua, La Paz, Mazatlan",
  "America/Phoenix": "Arizona",
  "America/Chicago": "Central Time",
  "America/Regina": "Saskatchewan",
  "America/Mexico_City": "Guadalajara, Mexico City, Monterrey",
  "America/Belize": "Central America",
  "America/Detroit": "Eastern Time",
  "America/Bogota": "Bogota, Lima, Quito",
  "America/Caracas": "Caracas, La Paz",
  "America/Santiago": "Santiago",
  "America/St_Johns": "Newfoundland and Labrador",
  "America/Sao_Paulo": "Brasilia",
  "America/Tijuana": "Tijuana",
  "America/Montevideo": "Montevideo",
  "America/Argentina/Buenos_Aires": "Buenos Aires, Georgetown",
  "America/Godthab": "Greenland",
  "America/Los_Angeles": "Pacific Time",
  "Atlantic/Azores": "Azores",
  "Atlantic/Cape_Verde": "Cape Verde Islands",
  "Etc/GMT": "UTC",
  "Europe/London": "Edinburgh, London",
  "Europe/Dublin": "Dublin",
  "Europe/Lisbon": "Lisbon",
  "Africa/Casablanca": "Casablanca, Monrovia",
  "Atlantic/Canary": "Canary Islands",
  "Europe/Belgrade": "Belgrade, Bratislava, Budapest, Ljubljana, Prague",
  "Europe/Sarajevo": "Sarajevo, Skopje, Warsaw, Zagreb",
  "Europe/Brussels": "Brussels, Copenhagen, Madrid, Paris",
  "Europe/Amsterdam": "Amsterdam, Berlin, Bern, Rome, Stockholm, Vienna",
  "Africa/Algiers": "West Central Africa",
  "Europe/Bucharest": "Bucharest",
  "Africa/Cairo": "Cairo",
  "Europe/Helsinki": "Helsinki, Kiev, Riga, Sofia, Tallinn, Vilnius",
  "Europe/Athens": "Athens, Istanbul, Minsk",
  "Asia/Jerusalem": "Jerusalem",
  "Africa/Harare": "Harare, Pretoria",
  "Europe/Moscow": "Moscow, St. Petersburg, Volgograd",
  "Asia/Kuwait": "Kuwait, Riyadh",
  "Africa/Nairobi": "Nairobi",
  "Asia/Baghdad": "Baghdad",
  "Asia/Tehran": "Tehran",
  "Asia/Dubai": "Abu Dhabi, Muscat",
  "Asia/Baku": "Baku, Tbilisi, Yerevan",
  "Asia/Kabul": "Kabul",
  "Asia/Yekaterinburg": "Ekaterinburg",
  "Asia/Karachi": "Islamabad, Karachi, Tashkent",
  "Asia/Kolkata": "Chennai, Kolkata, Mumbai, New Delhi",
  "Asia/Kathmandu": "Kathmandu",
  "Asia/Dhaka": "Astana, Dhaka",
  "Asia/Colombo": "Sri Jayawardenepura",
  "Asia/Almaty": "Almaty, Novosibirsk",
  "Asia/Rangoon": "Yangon Rangoon",
  "Asia/Bangkok": "Bangkok, Hanoi, Jakarta",
  "Asia/Krasnoyarsk": "Krasnoyarsk",
  "Asia/Shanghai": "Beijing, Chongqing, Hong Kong SAR, Urumqi",
  "Asia/Kuala_Lumpur": "Kuala Lumpur, Singapore",
  "Asia/Taipei": "Taipei",
  "Australia/Perth": "Perth",
  "Asia/Irkutsk": "Irkutsk, Ulaanbaatar",
  "Asia/Seoul": "Seoul",
  "Asia/Tokyo": "Osaka, Sapporo, Tokyo",
  "Asia/Yakutsk": "Yakutsk",
  "Australia/Darwin": "Darwin",
  "Australia/Adelaide": "Adelaide",
  "Australia/Sydney": "Canberra, Melbourne, Sydney",
  "Australia/Brisbane": "Brisbane",
  "Australia/Hobart": "Hobart",
  "Asia/Vladivostok": "Vladivostok",
  "Pacific/Guam": "Guam, Port Moresby",
  "Asia/Magadan": "Magadan, Solomon Islands, New Caledonia",
  "Asia/Kamchatka": "Kamchatka, Marshall Islands",
  "Pacific/Fiji": "Fiji Islands",
  "Pacific/Auckland": "Auckland, Wellington",
  "Pacific/Tongatapu": "Nuku'alofa",
};
