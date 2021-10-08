export const PLAN_PRODUCT_IDS = {
  FREE: "FREE",
  FREELANCER: process.env.NEXT_PUBLIC_FREELANCE_PRODUCT_ID as string,
  BUSINESS: process.env.NEXT_PUBLIC_BUSINESS_PRODUCT_ID as string,
};

export const PLAN_PRICE_IDS = {
  FREE: "FREE",
  FREELANCER: process.env.NEXT_PUBLIC_FREELANCE_PRICE_ID as string,
  BUSINESS: process.env.NEXT_PUBLIC_BUSINESS_PRICE_ID as string,
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

export function getStatusHistoryAccessFromProductId(id: string | undefined) {
  switch (id) {
    case PLAN_PRODUCT_IDS.FREELANCER:
      return 30 * 24 * 60 * 60 * 1000;
    case PLAN_PRODUCT_IDS.BUSINESS:
      return 365 * 24 * 60 * 60 * 1000;
    default:
      return 7 * 24 * 60 * 60 * 1000;
  }
}

// The same as monitor status access for now.
export function getAlertInvocationHistoryAccessFromProductId(
  id: string | undefined
) {
  return getStatusHistoryAccessFromProductId(id);
}

export function getAlertRecipientLimitFromProductId(id: string | undefined) {
  switch (id) {
    case PLAN_PRODUCT_IDS.FREELANCER:
      return 5;
    case PLAN_PRODUCT_IDS.BUSINESS:
      return 10;
    default:
      return 1;
  }
}
