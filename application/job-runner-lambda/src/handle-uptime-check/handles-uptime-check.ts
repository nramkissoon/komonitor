import {
  AttributeValue,
  DynamoDBClient,
  QueryCommand,
} from "@aws-sdk/client-dynamodb";
import {
  InvocationType,
  InvokeCommand,
  InvokeCommandInput,
  LambdaClient,
} from "@aws-sdk/client-lambda";
import { unmarshall } from "@aws-sdk/util-dynamodb";
import { Config } from "src/config";
import { UptimeMonitorJob } from "types";

const asyncInvokeLambda = async (
  lambdaClient: LambdaClient,
  jobs: UptimeMonitorJob[],
  config: Config
) => {
  const event = {
    jobs: jobs,
  };

  const input: InvokeCommandInput = {
    FunctionName: config.uptimeCheckLambdaName,
    InvocationType: InvocationType.Event, // asynchronous invocation type
    Payload: new Uint8Array(Buffer.from(JSON.stringify(event))),
  };

  const command = new InvokeCommand(input);
  return await lambdaClient.send(command);
};

const checkUnmarshalledItemIsMonitorJob = (item: {
  [key: string]: AttributeValue;
}) => {
  return (
    item.monitor_id &&
    item.url &&
    item.name &&
    item.region &&
    item.retries !== undefined
  );
};

const convertDdbItemsToUptimeMonitorJobs = (
  items: {
    [key: string]: AttributeValue;
  }[]
): UptimeMonitorJob[] => {
  const jobs: UptimeMonitorJob[] = [];
  items.forEach((item) => {
    const unmarshalled = unmarshall(item);
    if (checkUnmarshalledItemIsMonitorJob(unmarshalled)) {
      const job: UptimeMonitorJob = {
        monitor_id: unmarshalled.monitor_id,
        url: unmarshalled.url,
        name: unmarshalled.name,
        region: unmarshalled.region,
        retries: unmarshalled.retries,
      };
      jobs.push(job);
    }
  });
  return jobs;
};

export const handleUptimeCheck = async (
  lambda: LambdaClient,
  ddb: DynamoDBClient,
  config: Config,
  frequency: number
) => {
  let lastEvaluatedKey: any = "init";
  let totalJobs = 0;

  while (lastEvaluatedKey !== null) {
    const command: QueryCommand = new QueryCommand({
      TableName: config.uptimeCheckMonitorTableName,
      IndexName: config.uptimeCheckMonitorTableFrequencyGsiName,
      ExclusiveStartKey:
        lastEvaluatedKey === "init" ? undefined : lastEvaluatedKey,
      ExpressionAttributeNames: { "#r": "region" },
      KeyConditionExpression:
        "frequency = :partitionkeyval AND #r = :sortkeyval",
      ExpressionAttributeValues: {
        ":partitionkeyval": { N: frequency.toString() },
        ":sortkeyval": { S: config.region },
      },
    });

    try {
      const response = await ddb.send(command);

      if (
        response.$metadata.httpStatusCode !== 200 ||
        response.Count === 0 ||
        response.Count === undefined ||
        response.Items === undefined
      ) {
        throw new Error(
          `${response.$metadata.httpStatusCode} received. ${response.Count} count. ${response.Items} items.`
        );
      }

      lastEvaluatedKey = response.LastEvaluatedKey || null;
      // TODO log count
      console.log(`${response.Count} db items retrieved`);
      let offset = 0;
      let processed = 0;
      while (processed < response.Count) {
        let jobs = [];
        if (
          // If we should just go to the end of the array
          offset + config.uptimeCheckLambdaJobLimit >=
          response.Items.length
        ) {
          jobs = convertDdbItemsToUptimeMonitorJobs(
            response.Items.slice(offset, undefined)
          );
        } else {
          jobs = convertDdbItemsToUptimeMonitorJobs(
            response.Items.slice(
              offset,
              offset + config.uptimeCheckLambdaJobLimit
            )
          );
        }
        const res = await asyncInvokeLambda(lambda, jobs, config);
        console.log(`${res.StatusCode} status code`);
        console.log(`${jobs.length} jobs about to be sent to lambda`);
        console.log("lambda invoked");
        processed += jobs.length;
        offset += config.uptimeCheckLambdaJobLimit;
      }
      totalJobs += processed;
    } catch (err) {
      lastEvaluatedKey = null;
      // TODO log err
      console.log((err as Error).message);
      continue;
    }
  }

  return totalJobs;
};
