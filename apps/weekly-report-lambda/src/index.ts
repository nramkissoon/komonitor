import { performance } from "perf_hooks";
import { config, ddbClient } from "./config";
import { getEmailOptedInUsers } from "./dynamo-db";
import { sendEmailReportToUser } from "./emailReport";

export const handler = async (event: any) => {
  const start = performance.now();
  try {
    const users = await getEmailOptedInUsers(ddbClient, config.userTableName);
    if (users) {
      let emailPromises: Promise<boolean>[] = [];
      for (let user of users) {
        emailPromises.push(sendEmailReportToUser(user));
      }
      await Promise.allSettled(emailPromises);
    }
  } catch (err) {
    console.error(err);
  }

  const end = performance.now();
  return {
    statusCode: 200,
    latency: end - start,
  };
};
