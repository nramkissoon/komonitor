import {
  SupportedRegion,
  UptimeMonitorJob,
  UptimeMonitorStatus,
  UptimeMonitorWebhookNotification,
} from "types";
import request from "request";
import AbortController from "abort-controller";
import { writeStatusToDB } from "./status-db";

const controller = new AbortController();
const fetchTimeout = setTimeout(() => {
  controller.abort();
}, 5000);

const fetchCall = async (url: string) => {
  const res = await new Promise<
    { ok: boolean; latency: number | undefined } | undefined
  >((resolve, reject) =>
    request(
      {
        url: url,
        method: "GET",
        time: true,
        timeout: 5000,
        headers: {
          "User-Agent": "isthisfine",
        },
      },
      (err, response) => {
        if (err) {
          resolve({ ok: false, latency: undefined });
        } else {
          resolve({
            ok: response.statusCode
              ? response.statusCode >= 200 && response.statusCode < 300
              : false,
            latency: response.timingPhases?.total,
          });
        }
      }
    )
  );

  return { response: res?.ok, latency: res?.latency };
};

const webhookNotifyCall = async (
  url: string,
  webhookNotification: UptimeMonitorWebhookNotification
) => {
  let response: Response;
  try {
    response = await fetch(url, {
      method: "POST",
      headers: {
        "User-Agent": "isthisfine",
        "Content-Type": "application/json",
      },
      signal: controller.signal,
      body: JSON.stringify(webhookNotification),
    });

    return response;
  } finally {
    clearTimeout(fetchTimeout);
  }
};

const buildMonitorStatus = (
  ok: boolean,
  latencies: number[],
  monitor_id: string,
  region: SupportedRegion
): UptimeMonitorStatus => {
  return {
    monitor_id: monitor_id,
    timestamp: new Date().getTime(),
    status: ok ? "up" : "down",
    latency:
      latencies.length >= 1
        ? latencies.reduce((a, b) => a + b) / latencies.length
        : -1,
    region: region,
  };
};

const buildWebhook = (
  monitorStatus: UptimeMonitorStatus,
  url: string,
  name: string
): UptimeMonitorWebhookNotification => {
  return {
    trigger: monitorStatus.status,
    monitor_type: "uptime",
    latency: monitorStatus.latency,
    region: monitorStatus.region,
    url: url,
    name: name,
  };
};

export const runJob = async (job: UptimeMonitorJob) => {
  const { name, url, retries, region, webhook_url, monitor_id } = job;

  const latencies: number[] = [];

  let fetchResult = await fetchCall(url);
  if (fetchResult.response?.valueOf() && fetchResult.latency !== undefined) {
    latencies.push(fetchResult.latency);
  }

  if (!fetchResult.response?.valueOf()) {
    // enter retry mode
    let retriesRemaining = retries;
    while (retriesRemaining > 0 && !fetchResult.response?.valueOf()) {
      fetchResult = await fetchCall(url);
      if (fetchResult.latency !== undefined) {
        latencies.push(fetchResult.latency);
      }
      retriesRemaining -= 1;
    }
  }

  const status = buildMonitorStatus(
    fetchResult.response !== undefined ? fetchResult.response.valueOf() : false,
    latencies,
    monitor_id,
    region
  );

  try {
    writeStatusToDB(status);
  } catch (err) {}

  if (webhook_url) {
    const webhook = buildWebhook(status, url, name);
    // no await, keep it pushing
    webhookNotifyCall(webhook_url, webhook);
  }
};
