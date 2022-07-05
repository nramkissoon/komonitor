import Email from "email-templates";
import { UptimeMonitor, UptimeMonitorStatus, User } from "utils";
import {
  config,
  ddbClient,
  emailTransporter,
  getMonthName,
  oneWeekAndOneDayAgo,
  regionToLocationStringMap,
  yesterday,
} from "./config";
import {
  getMonitorsForUser,
  getStatusesForMultipleMonitors1Week,
  getTotalAlertsForMultipleMonitors1Week,
} from "./dynamo-db";

interface EmailProps {
  overEmailLimit: boolean;
  projects: any;
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
      from: "weekly-report@komonitor.com",
      to: user.email,
      html: html,
      subject: subject,
    });
    return true;
  } catch (err) {
    throw err as Error;
  }
};

const sortUptimeMonitorsByProject = async (monitors: UptimeMonitor[]) => {
  const emailLimit = 5;
  let overLimit = false;
  const projectIds = new Set(monitors.map((m) => m.project_id));
  const monitorIds = monitors.map((monitor) => monitor.monitor_id);
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
  const result = [];
  for (let id of projectIds) {
    const list = monitors.filter((m) => m.project_id === id);
    const withData = list.map((m) => ({
      uptime: calculateUptime(uptimeStatuses[m.monitor_id])
        ? calculateUptime(uptimeStatuses[m.monitor_id]) + "%"
        : "No data.",
      alerts: uptimeAlerts[m.monitor_id],
      name: m.name,
      url: m.url,
      region: regionToLocationStringMap[m.region],
    }));
    overLimit = overLimit || list.length > emailLimit;
    result.push({
      projectId: id,
      monitors: withData.slice(0, Math.min(emailLimit, list.length)),
    });
  }
  return { result, overLimit };
};

export const sendEmailReportToUser = async (user: User): Promise<boolean> => {
  try {
    const uptimeMonitors = await getMonitorsForUser(
      ddbClient,
      config.uptimeMonitorTableName,
      user.id
    );

    if (uptimeMonitors.length === 0) throw new Error("no monitors");

    const includedMonitorsByProject = await sortUptimeMonitorsByProject(
      uptimeMonitors
    );

    const emailProps: EmailProps = {
      overEmailLimit: includedMonitorsByProject.overLimit,
      projects: includedMonitorsByProject.result,
    };

    await sendEmail(user, emailProps);

    return true;
  } catch (err) {
    console.log(err);
    return false;
  }
};
