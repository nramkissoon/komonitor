export const env = {
  BASE_URL: process.env.BASE_URL as string,
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
