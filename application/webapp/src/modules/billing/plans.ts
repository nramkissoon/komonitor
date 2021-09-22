export const PLAN_PRODUCT_IDS = {
  FREE: "FREE",
  FREELANCER: process.env.FREELANCE_PRODUCT_ID as string,
  BUSINESS: process.env.BUSINESS_PRODUCT_ID as string,
};

export function getUptimeMonitorAllowanceFromProductId(id: string | undefined) {
  switch (id) {
    case PLAN_PRODUCT_IDS.FREELANCER:
      return 80;
    case PLAN_PRODUCT_IDS.BUSINESS:
      return 500;
    default:
      return 20;
  }
}

export function getAlertAllowanceFromProductId(id: string | undefined) {
  switch (id) {
    case PLAN_PRODUCT_IDS.FREELANCER:
      return 20;
    case PLAN_PRODUCT_IDS.BUSINESS:
      return 50;
    default:
      return 3;
  }
}
