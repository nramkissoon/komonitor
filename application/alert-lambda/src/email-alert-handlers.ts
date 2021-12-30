import Email from "email-templates";
import { Alert, UptimeMonitor, UptimeMonitorStatus, User } from "project-types";
import {
  convertUptimeMonitorStatusesToStatusesWithReadableTimeStamp,
  emailTransporter,
  regionToLocationStringMap,
} from "./config";

export async function sendUptimeMonitorAlertEmail(
  monitor: UptimeMonitor,
  alert: Alert,
  statuses: UptimeMonitorStatus[],
  user: User
): Promise<boolean> {
  try {
    const tz = user.tz ?? "Etc/GMT";
    const statusesForTemplate =
      convertUptimeMonitorStatusesToStatusesWithReadableTimeStamp(tz, statuses);
    const email = new Email();
    const html = await email.render("uptime/html", {
      severity: alert.severity.toUpperCase(),
      monitor: monitor,
      alert: alert,
      region: regionToLocationStringMap[monitor.region],
      failures: monitor.failures_before_alert,
      statuses: statusesForTemplate,
    });
    const subject = await email.render("uptime/subject", {
      severity: alert.severity.toUpperCase(),
      monitorName: monitor.name,
      monitorRegion: regionToLocationStringMap[monitor.region],
      alertName: alert.name,
      failures: monitor.failures_before_alert,
      statuses: statusesForTemplate,
    });
    await emailTransporter.sendMail({
      from: "no-reply@komonitor.com",
      to: alert.recipients,
      html: html,
      subject: subject,
    });
    return true;
  } catch (err) {
    console.error(err);
    return false;
  }
}
