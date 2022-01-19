import got, { Options, OptionsOfUnknownResponseBody, Response } from "got";
import {
  HttpMethods,
  UptimeMonitorStatus,
  UptimeStatusRequest,
  UptimeStatusResponse,
} from "project-types";

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
    ...rest
  } = options;
  return { ...rest };
};

const buildUptimeStatusResponse = (
  response: Response
): UptimeStatusResponse => {
  const {
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
  body?: string
): Promise<Pick<UptimeMonitorStatus, "request" | "response">> => {
  const options: OptionsOfUnknownResponseBody = {
    headers: { ...httpHeaders },
    timeout: { response: 5000 },
    body: body,
    allowGetBody: true,
    retry: {
      limit: 1,
      maxRetryAfter: undefined,
    },
    throwHttpErrors: false,
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
