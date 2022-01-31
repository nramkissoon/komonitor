import {
  InvocationType,
  InvokeCommand,
  InvokeCommandInput,
} from "@aws-sdk/client-lambda";
import AbortController from "abort-controller";
import {
  MonitorTypes,
  UptimeMonitor,
  UptimeMonitorStatus,
  UptimeMonitorWebhookNotification,
} from "project-types";
import { config } from "./config";
import {
  getPreviousAlertInvocationForMonitor,
  writeAlertInvocation,
  writeStatusToDB,
} from "./db";
import { request } from "./http";

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
  fetchResult: Pick<UptimeMonitorStatus, "request" | "response">,
  monitor: UptimeMonitor
): UptimeMonitorStatus => {
  return {
    monitor_id: monitor.monitor_id,
    timestamp: new Date().getTime(),
    status:
      fetchResult.response.statusCode >= 200 &&
      fetchResult.response.statusCode < 300
        ? "up"
        : "down",
    response: fetchResult.response,
    request: fetchResult.request,
    monitor_snapshot: monitor,
  };
};

// const buildWebhook = (
//   monitorStatus: UptimeMonitorStatus,
//   url: string,
//   name: string
// ): UptimeMonitorWebhookNotification => {
//   return {
//     trigger: monitorStatus.status,
//     monitor_type: "uptime",
//     latency: monitorStatus.response.latency,
//     region: monitorStatus.monitor_snapshot.region,
//     url: url,
//     name: name,
//   };
// };

export const runJob = async (job: UptimeMonitor) => {
  const { url, monitor_id, owner_id, http_parameters, alert } = job;

  try {
    let fetchResult = await request(
      url,
      http_parameters.method,
      http_parameters.headers ?? {},
      http_parameters.body ?? undefined,
      http_parameters.follow_redirects
    );

    const status = buildMonitorStatus(fetchResult as any, job);
    console.log(status);
    const dbWriteResponse = await writeStatusToDB(status);

    // if (webhook_url) {
    //   const webhook = buildWebhook(status, url, name);

    //   await webhookNotifyCall(webhook_url, webhook);
    // }

    if (status.status === "up" && alert) {
      const lastAlertForMonitor = await getPreviousAlertInvocationForMonitor(
        monitor_id,
        config.alertInvocationTableName
      );

      if (lastAlertForMonitor && lastAlertForMonitor.ongoing) {
        lastAlertForMonitor.ongoing = false; // no longer in alert
        const res = await writeAlertInvocation(
          config.alertInvocationTableName,
          lastAlertForMonitor
        );

        // TODO invoke lambda
      }
    }

    if (status.status === "down" && alert) {
      const res = await asyncInvokeLambda({
        monitorId: monitor_id,
        ownerId: owner_id,
        monitorType: "uptime-monitor",
      });
    }
  } catch (err) {
    console.log(err);
  }
};
