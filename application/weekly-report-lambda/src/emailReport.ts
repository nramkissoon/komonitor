import Email from "email-templates";
import { UptimeMonitor, UptimeMonitorStatus, User } from "project-types";
import {
  config,
  ddbClient,
  emailTransporter,
  getMonthName,
  oneWeekAndOneDayAgo,
  yesterday,
} from "./config";
import {
  getMonitorsForUser,
  getStatusesForMultipleMonitors1Week,
  getTotalAlertsForMultipleMonitors1Week,
} from "./dynamo-db";

interface EmailProps {
  overEmailLimit: boolean;
  monitorData: (
    | Pick<UptimeMonitor, "name" | "url" | "region">
    | {
        uptime: string;
        alerts: number;
      }
  )[];
}

const calculateUptime = (statuses: UptimeMonitorStatus[]) => {
  const total = statuses.length;
  if (total === 0) return undefined;
  const totalUp = statuses.filter((status) => status.status === "up").length;

  return ((100 * totalUp) / total).toFixed(3);
};

const sendEmail = async (
  user: User,
  emailProps: EmailProps
): Promise<boolean> => {
  try {
    const from = new Date(oneWeekAndOneDayAgo());
    const to = new Date(yesterday());
    const email = new Email();
    const html = await email.render("html", {
      ...emailProps,
      fromMonth: getMonthName(from.getMonth()),
      toMonth: getMonthName(to.getMonth()),
      fromDate: from.getDate(),
      toDate: to.getDate(),
    });
    const subject = await email.render("subject", {
      fromMonth: getMonthName(from.getMonth()),
      toMonth: getMonthName(to.getMonth()),
      fromDate: from.getDate(),
      toDate: to.getDate(),
    });
    await emailTransporter.sendMail({
      from: "no-reply@komonitor.com",
      to: user.email,
      html: html,
      subject: subject,
    });
    return true;
  } catch (err) {
    throw err as Error;
  }
};

export const sendEmailReportToUser = async (user: User): Promise<boolean> => {
  try {
    const uptimeMonitors = await getMonitorsForUser(
      ddbClient,
      config.uptimeMonitorTableName,
      user.id
    );

    if (uptimeMonitors.length === 0) throw new Error("no monitors");

    const emailLimit = 8;

    const overEmailLimit = uptimeMonitors.length > emailLimit;

    const includedUptimeMonitors = uptimeMonitors
      .map((monitor) => ({
        name: monitor.name,
        id: monitor.monitor_id,
        url: monitor.url,
        region: monitor.region,
      }))
      .slice(0, Math.min(emailLimit, uptimeMonitors.length));

    const monitorIds = includedUptimeMonitors.map((monitor) => monitor.id);

    const uptimeStatuses = await getStatusesForMultipleMonitors1Week(
      ddbClient,
      monitorIds,
      config.uptimeMonitorStatusTableName
    );

    const uptimeAlerts = await getTotalAlertsForMultipleMonitors1Week(
      ddbClient,
      monitorIds,
      config.alertInvocationTableName
    );

    const emailProps: EmailProps = {
      overEmailLimit: overEmailLimit,
      monitorData: includedUptimeMonitors.map((monitor) => ({
        uptime: calculateUptime
          ? calculateUptime + "%"
          : "Unable to calculate uptime.",
        alerts: uptimeAlerts,
        name: monitor.name,
        url: monitor.url,
        region: monitor.region,
      })),
    };

    await sendEmail(user, emailProps);

    return true;
  } catch (err) {
    console.log(err);
    return false;
  }
};
