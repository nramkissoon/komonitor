import crypto from "crypto";
import got, { OptionsOfUnknownResponseBody } from "got";
import { AlertInvocation, WebhookSecret } from "utils";

export const createAlertInvocationSignature = (
  data: { type: string; data: AlertInvocation },
  secret: WebhookSecret
) => {
  const hmac = crypto.createHmac("sha256", secret.value);
  hmac.update(JSON.stringify(data), "utf-8");
  return hmac.digest("hex");
};

export const webhookRequestAlert = async (
  url: string,
  invocation: AlertInvocation,
  secret: WebhookSecret
) => {
  try {
    const requestId = crypto.randomUUID();
    const data = { type: "uptime-monitor-status", data: invocation };
    const options: OptionsOfUnknownResponseBody = {
      headers: {
        "content-type": "application/json",
        "request-id": requestId,
        "komonitor-hook-type": "uptime-monitor-status",
        "komonitor-hook-timestamp": new Date().getTime().toString(),
        "komonitor-hook-signature": createAlertInvocationSignature(
          data,
          secret
        ),
        "user-agent": "komonitor",
      },
      retry: {
        limit: 1,
        maxRetryAfter: undefined,
      },
      timeout: { response: 3000 },
      method: "POST",
      body: JSON.stringify(data),
    };
    const sent = await new Promise<boolean>(async (resolve, reject) => {
      try {
        const res = await got.post(url, options);
        resolve(true);
      } catch (err) {
        console.error(err);
        resolve(false);
      }
    });
    return sent;
  } catch (err) {
    console.log(err);
    return false;
  }
};
