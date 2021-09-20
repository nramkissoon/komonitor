import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { LambdaClient } from "@aws-sdk/client-lambda";
import { performance } from "perf_hooks";
import { config } from "./config";
import { handleUptimeCheck } from "./handle-uptime-check/handles-uptime-check";

export const handler = async (event: any) => {
  const start = performance.now();

  if (event.periodInMinutes) {
    const frequency: number = event.periodInMinutes;
    const ddb = new DynamoDBClient({ region: config.region });
    const uptimeCheckLambda = new LambdaClient({ region: config.region });

    await Promise.allSettled([
      handleUptimeCheck(uptimeCheckLambda, ddb, config, frequency),
    ]);
  } else {
    // TODO log invalid event
    console.log("invalid event");
  }

  const end = performance.now();
  return {
    statusCode: 200,
    latency: end - start,
  };
};
