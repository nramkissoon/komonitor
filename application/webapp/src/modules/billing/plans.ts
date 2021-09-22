export const PLAN_PRODUCT_IDS = {
  FREE: "FREE",
  FREELANCER: process.env.FREELANCE_PRODUCT_ID as string,
  ENTERPRISE: process.env.ENTERPRISE_PRODUCT_ID as string,
};

export function getUptimeMonitorAllowanceFromProductId(id: string | undefined) {
  switch (id) {
    case PLAN_PRODUCT_IDS.FREELANCER:
      return 80;
    case PLAN_PRODUCT_IDS.ENTERPRISE:
      return 500;
    default:
      return 20;
  }
}

export function getAlertAllowanceFromProductId(id: string | undefined) {
  switch (id) {
    case PLAN_PRODUCT_IDS.FREELANCER:
      return 20;
    case PLAN_PRODUCT_IDS.ENTERPRISE:
      return 50;
    default:
      return 3;
  }
}
