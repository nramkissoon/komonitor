import {
  InvocationType,
  InvokeCommand,
  InvokeCommandInput,
} from "@aws-sdk/client-lambda";
import AbortController from "abort-controller";
import {
  MonitorTypes,
  UptimeMonitorJob,
  UptimeMonitorStatus,
  UptimeMonitorWebhookNotification,
} from "project-types";
import request from "request";
import { config } from "./config";
import { writeStatusToDB } from "./status-db";

const asyncInvokeLambda = async (event: {
  monitorId: string;
  ownerId: string;
  monitorType: MonitorTypes;
}) => {
  const input: InvokeCommandInput = {
    FunctionName: config.ALERT_LAMBDA_NAME,
    InvocationType: InvocationType.Event, // asynchronous invocation type
    Payload: new Uint8Array(Buffer.from(JSON.stringify(event))),
  };

  const command = new InvokeCommand(input);
  return await config.lambdaClient.send(command);
};

const controller = new AbortController();
const fetchTimeout = setTimeout(() => {
  controller.abort();
}, 5000);

const fetchCall = async (
  url: string,
  httpHeaders?: { [header: string]: string }
) => {
  try {
    const res = await new Promise<
      | { ok: boolean; code: number | undefined; latency: number | undefined }
      | undefined
    >((resolve, reject) =>
      request(
        {
          url: url,
          method: "GET",
          time: true,
          timeout: 5000,
          headers: {
            ...httpHeaders,
          },
        },
        (err, response) => {
          if (err) {
            resolve({
              ok: false,
              code: response ? response.statusCode : undefined,
              latency: undefined,
            });
          } else {
            resolve({
              ok: response?.statusCode
                ? (response.statusCode >= 200 && response.statusCode < 300) ||
                  response.statusCode === 429 // Too many requests
                : false,
              code: response.statusCode,
              latency: response.timingPhases?.firstByte,
            });
          }
        }
      )
    );

    return { response: res?.ok, statusCode: res?.code, latency: res?.latency };
  } catch (err) {
    return { response: false, statusCode: undefined, latency: undefined };
  }
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
        "User-Agent": "Komonitor",
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
  region: string,
  responseStatusCode: number
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
    response_status_code: responseStatusCode,
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
  const { name, url, region, webhook_url, monitor_id, owner_id, http_headers } =
    job;

  const latencies: number[] = [];

  let fetchResult = await fetchCall(url, http_headers ?? {});
  if (fetchResult.response?.valueOf() && fetchResult.latency !== undefined) {
    latencies.push(fetchResult.latency);
  }

  const status = buildMonitorStatus(
    fetchResult.response !== undefined ? fetchResult.response.valueOf() : false,
    latencies,
    monitor_id,
    region,
    fetchResult.statusCode === undefined ? -1 : fetchResult.statusCode
  );

  try {
    const dbWriteResponse = await writeStatusToDB(status);
  } catch (err) {}

  if (webhook_url) {
    const webhook = buildWebhook(status, url, name);

    await webhookNotifyCall(webhook_url, webhook);
  }

  if (status.status === "down") {
    const res = await asyncInvokeLambda({
      monitorId: monitor_id,
      ownerId: owner_id,
      monitorType: "uptime-monitor",
    });
    console.log(`${res.StatusCode} status code: alert lambda invocation`);
  }
};
