export const PLAN_PRODUCT_IDS = {
  STARTER: "FREE",
  PRO: process.env.NEXT_PUBLIC_PRO_PRODUCT_ID as string,
  BUSINESS: process.env.NEXT_PUBLIC_BUSINESS_PRODUCT_ID as string,
};

export const PLAN_PRICE_IDS = {
  MONTHLY: {
    STARTER: "FREE",
    PRO: process.env.NEXT_PUBLIC_PRO_PRICE_ID_MONTHLY as string,
    BUSINESS: process.env.NEXT_PUBLIC_BUSINESS_PRICE_ID_MONTHLY as string,
  },
  ANNUAL: {
    STARTER: "FREE",
    PRO: process.env.NEXT_PUBLIC_PRO_PRICE_ID_ANNUAL as string,
    BUSINESS: process.env.NEXT_PUBLIC_BUSINESS_PRICE_ID_ANNUAL as string,
  },
};

export function getUptimeMonitorAllowanceFromProductId(id: string | undefined) {
  switch (id) {
    case PLAN_PRODUCT_IDS.PRO:
      return 500;
    case PLAN_PRODUCT_IDS.BUSINESS:
      return 2500;
    default:
      return 80;
  }
}

export function getProjectAllowanceFromProductId(id: string | undefined) {
  if (!id || id === PLAN_PRODUCT_IDS.STARTER) {
    return 10;
  }
}

export function getStatusHistoryAccessFromProductId(id: string | undefined) {
  switch (id) {
    case PLAN_PRODUCT_IDS.PRO:
      return 365 * 24 * 60 * 60 * 1000;
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
    case PLAN_PRODUCT_IDS.PRO:
      return 5;
    case PLAN_PRODUCT_IDS.BUSINESS:
      return 10;
    default:
      return 1;
  }
}
