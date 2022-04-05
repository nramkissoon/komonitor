import * as crypto from "crypto";
import got, { Options, OptionsOfUnknownResponseBody, Response } from "got";
import {
  HttpMethods,
  toExternalUptimeStatusObject,
  UptimeMonitorStatus,
  UptimeStatusRequest,
  UptimeStatusResponse,
  WebhookSecret,
} from "utils";
import { createUptimeStatusSignature } from "./utils";

const buildUptimeStatusRequestOptions = (
  options: Options
): UptimeStatusRequest => {
  const {
    parseJson,
    stringifyJson,
    pagination,
    hooks,
    request,
    retry,
    throwHttpErrors,
    ...rest
  } = options;
  return { ...rest };
};

const buildUptimeStatusResponse = (
  response: Response
): UptimeStatusResponse => {
  let {
    timings,
    body,
    headers,
    requestUrl,
    ip,
    redirectUrls,
    url,
    retryCount,
    statusCode,
    statusMessage,
    isFromCache,
    aborted,
    complete,
  } = response;

  return {
    timings,
    body,
    headers,
    redirectUrls,
    requestUrl,
    retryCount,
    ip,
    url,
    statusCode,
    statusMessage,
    isFromCache,
    aborted,
    complete,
  };
};

export const request = async (
  url: string,
  method: HttpMethods,
  httpHeaders?: { [header: string]: string },
  body?: string,
  followRedirects?: boolean
): Promise<Pick<UptimeMonitorStatus, "request" | "response">> => {
  const options: OptionsOfUnknownResponseBody = {
    headers: { ...httpHeaders, "User-Agent": "komonitor" },
    timeout: { response: 5000 },
    body: body,
    allowGetBody: true,
    retry: {
      limit: 1,
      maxRetryAfter: undefined,
    },
    throwHttpErrors: false,
    followRedirect: followRedirects,
  };
  try {
    let response: Response<unknown>;
    switch (method) {
      case "GET":
        response = await got.get(url, options);
        break;

      case "DELETE":
        response = await got.delete(url, options);
        break;

      case "HEAD":
        response = await got.head(url, options);
        break;

      case "PATCH":
        response = await got.patch(url, options);
        break;

      case "PUT":
        response = await got.put(url, options);
        break;

      case "POST":
        response = await got.post(url, options);
        break;

      default:
        // default to GET
        response = await got.get(url, options);
        break;
    }
    return {
      request: buildUptimeStatusRequestOptions(response.request.options),
      response: buildUptimeStatusResponse(response),
    };
  } catch (err) {
    // in the case of Request errors, etc.
    return {
      request: options,
      response: {
        body: undefined,
        redirectUrls: [url],
        headers: {},
        url: url,
        timings: { phases: {}, start: -1 },
        requestUrl: url,
        statusCode: -1,
        statusMessage: (err as Error).name,
        isFromCache: false,
        aborted: true,
        complete: false,
        retryCount: 0,
      },
    };
  }
};

export const webhookRequest = async (
  url: string,
  status: UptimeMonitorStatus,
  secret: WebhookSecret
) => {
  try {
    const requestId = crypto.randomUUID();
    const data = {
      type: "uptime-monitor-status",
      data: toExternalUptimeStatusObject(status),
    };
    const options: OptionsOfUnknownResponseBody = {
      headers: {
        "content-type": "application/json",
        "request-id": requestId,
        "komonitor-hook-type": "uptime-monitor-status",
        "komonitor-hook-timestamp": new Date().getTime().toString(),
        "komonitor-hook-signature": createUptimeStatusSignature(data, secret),
        "user-agent": "komonitor",
      },
      retry: {
        limit: 0,
        maxRetryAfter: undefined,
      },
      timeout: { response: 3000 },
      method: "POST",
      body: JSON.stringify(data),
      throwHttpErrors: false,
    };
    const sent = await new Promise<boolean>(async (resolve, reject) => {
      try {
        (await got.post(url, options)).once("end", () => {
          resolve(true);
        });
      } catch (err) {
        reject(false);
      }
    });
  } catch (err) {
    console.log(err);
  }
};
