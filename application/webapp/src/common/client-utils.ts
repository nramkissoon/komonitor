import TimeAgo from "javascript-time-ago";
import en from "javascript-time-ago/locale/en";

export const env = {
  BASE_URL: process.env.NEXT_PUBLIC_BASE_URL as string,
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

TimeAgo.addDefaultLocale(en);
export const timeAgo = new TimeAgo("en-US");

export const regionToLocationStringMap = {
  "us-east-1": "Virginia, USA",
  "us-east-2": "Ohio, USA",
  "us-west-1": "Northern California, USA",
  "us-west-2": "Oregon, USA",
  "ap-south-1": "Mumbai, India",
  "ap-northeast-3": "Osaka, Japan",
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
