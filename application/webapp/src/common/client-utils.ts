import TimeAgo from "javascript-time-ago";
import en from "javascript-time-ago/locale/en.json";
import { DateTime } from "luxon";
import { useRouter } from "next/router";

export const env = {
  BASE_URL: process.env.NEXT_PUBLIC_BASE_URL as string,
  SLACK_REDIRECT: process.env.NEXT_PUBLIC_SLACK_REDIRECT as string,
};

export const minutesToString: { [key: number]: string } = {
  1: "Every minute",
  5: "Every 5 minutes",
  15: "Every 15 minutes",
  30: "Every 30 minutes",
  60: "Every hour",
  180: "Every 3 hours",
  360: "Every 6 hours",
  720: "Every 12 hours",
  1440: "Every 24 hours",
};

TimeAgo.addLocale(en);
export const timeAgo = new TimeAgo("en-US");

export const regionToLocationStringMap: { [key: string]: string } = {
  "us-east-1": "Virginia, USA",
  "us-east-2": "Ohio, USA",
  "us-west-1": "Northern California, USA",
  "us-west-2": "Oregon, USA",
  "ap-south-1": "Mumbai, India",
  "ap-northeast-2": "Seoul, South Korea",
  "ap-southeast-1": "Singapore",
  "ap-southeast-2": "Sydney, Australia",
  "ap-northeast-1": "Tokyo, Japan",
  "ca-central-1": "Central Canada",
  "eu-central-1": "Frankfurt, Germany",
  "eu-west-1": "Ireland",
  "eu-west-2": "London, UK",
  "eu-west-3": "Paris, France",
  "eu-north-1": "Stockholm, Sweden",
  "sa-east-1": "São Paulo, Brazil",
};

export function getTimeString(offset: number, timestamp: number) {
  let offsetString = "";
  if (offset > 0) {
    offsetString = "+" + offset;
  } else if (offset < 0) {
    offsetString = offset.toString();
  }
  return DateTime.fromMillis(timestamp)
    .setZone("UTC" + offsetString)
    .toLocaleString(DateTime.DATETIME_MED_WITH_SECONDS);
}

export const useAppBaseRoute = () => {
  const router = useRouter();
  const { teamId } = router.query;

  if (teamId) return "/teams/" + teamId;
  return "/app";
};
