import Email from "email-templates";
import { Alert, UptimeMonitor, UptimeMonitorStatus } from "project-types";
import { emailTransporter, regionToLocationStringMap } from "./config";

export async function sendUptimeMonitorAlertEmail(
  monitor: UptimeMonitor,
  alert: Alert,
  statuses: UptimeMonitorStatus[]
): Promise<boolean> {
  try {
    const email = new Email();
    const html = await email.render("uptime/html", {
      severity: alert.severity.toUpperCase(),
      monitor: monitor,
      alert: alert,
      failures: monitor.failures_before_alert,
      statuses: statuses,
    });
    const subject = await email.render("uptime/subject", {
      severity: alert.severity.toUpperCase(),
      monitorName: monitor.name,
      monitorRegion: regionToLocationStringMap[monitor.region],
      alertName: alert.name,
      failures: monitor.failures_before_alert,
      statuses: statuses,
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
