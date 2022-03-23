import {
  InvocationType,
  InvokeCommand,
  InvokeCommandInput,
} from "@aws-sdk/client-lambda";
import AbortController from "abort-controller";
import { MonitorTypes, UptimeMonitor, UptimeMonitorStatus } from "utils";
import { config } from "./config";
import {
  getOwnerById,
  getPreviousAlertInvocationForMonitor,
  writeAlertInvocation,
  writeStatusToDB,
} from "./db";
import { request, webhookRequest } from "./http";
import { runUpConditionChecks } from "./utils";

const asyncInvokeLambda = async (event: {
  monitorId: string;
  ownerId: string;
  monitorType: MonitorTypes;
  alertType: "incident_start" | "incident_end";
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

const buildMonitorStatus = (
  fetchResult: Pick<UptimeMonitorStatus, "request" | "response">,
  isUp: boolean,
  monitor: UptimeMonitor
): UptimeMonitorStatus => {
  return {
    monitor_id: monitor.monitor_id,
    timestamp: new Date().getTime(),
    status: isUp ? "up" : "down",
    response: fetchResult.response,
    request: fetchResult.request,
    monitor_snapshot: monitor,
  };
};

export const runJob = async (job: UptimeMonitor) => {
  const {
    url,
    monitor_id,
    owner_id,
    http_parameters,
    alert,
    up_condition_checks,
    webhook_url,
  } = job;

  try {
    let fetchResult = await request(
      url,
      http_parameters.method,
      http_parameters.headers ?? {},
      http_parameters.body ?? undefined,
      http_parameters.follow_redirects
    );

    let isUp = false;
    if (up_condition_checks && up_condition_checks.length > 0) {
      isUp = runUpConditionChecks(up_condition_checks, fetchResult.response);
    } else {
      // run the default check
      isUp = runUpConditionChecks(
        [{ type: "code", condition: { comparison: "equal", expected: 200 } }],
        fetchResult.response
      );
    }

    const status = buildMonitorStatus(fetchResult as any, isUp, job);
    const dbWriteResponse = await writeStatusToDB(status);

    if (webhook_url) {
      const owner = await getOwnerById(owner_id);
      const secret = owner?.webhook_secret;

      if (secret !== undefined) {
        await webhookRequest(webhook_url, status, secret);
      }
    }

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
        alertType: "incident_start",
      });
    }
  } catch (err) {
    console.log(err);
  }
};
