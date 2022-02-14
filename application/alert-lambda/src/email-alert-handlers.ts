import Email from "email-templates";
import { Alert, UptimeMonitor, UptimeMonitorStatus, User } from "utils";
import {
  convertUptimeMonitorStatusesToStatusesWithReadableTimeStampAndStatusCode,
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
      convertUptimeMonitorStatusesToStatusesWithReadableTimeStampAndStatusCode(
        tz,
        statuses
      );
    const email = new Email();
    const html = await email.render("uptime/html", {
      monitor: monitor,
      alert: alert,
      region: regionToLocationStringMap[monitor.region],
      failures: monitor.failures_before_alert,
      statuses: statusesForTemplate,
    });
    const subject = await email.render("uptime/subject", {
      monitorName: monitor.name,
      monitorRegion: regionToLocationStringMap[monitor.region],
      failures: monitor.failures_before_alert,
      statuses: statusesForTemplate,
    });
    await emailTransporter.sendMail({
      from: "no-reply@komonitor.com",
      to: alert.recipients.Email,
      html: html,
      subject: subject,
    });
    return true;
  } catch (err) {
    console.error(err);
    return false;
  }
}
