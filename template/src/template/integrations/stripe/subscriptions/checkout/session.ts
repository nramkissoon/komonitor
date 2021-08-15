export const clientCreateStripeSessionAndRedirect = async (
  priceId: string,
  createCheckoutApiUrl: string,
  userId: string,
  userEmail: string
) => {
  const response = await fetch(createCheckoutApiUrl, {
    method: "POST",
    mode: "cors",
    cache: "no-cache",
    credentials: "same-origin",
    headers: {
      "Content-Type": "application/json",
    },
    redirect: "follow",
    referrerPolicy: "no-referrer",
    body: JSON.stringify({
      priceId: priceId,
      userId: userId,
      userEmail: userEmail,
    }),
  });
};
