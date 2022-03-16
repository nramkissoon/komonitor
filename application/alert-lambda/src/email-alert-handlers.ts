import Email from "email-templates";
import { Alert, Team, UptimeMonitor, UptimeMonitorStatus, User } from "utils";
import {
  convertUptimeMonitorStatusesToStatusesWithReadableTimeStampAndStatusCode,
  emailTransporter,
  regionToLocationStringMap,
} from "./config";

const ownerIsTeam = (owner: User | Team): owner is Team => {
  return owner.type === "TEAM";
};

export async function sendUptimeMonitorAlertEmail(
  monitor: UptimeMonitor,
  alert: Alert,
  statuses: UptimeMonitorStatus[],
  owner: User | Team
): Promise<boolean> {
  try {
    const baseUrl =
      "https://komonitor.com/" +
      (ownerIsTeam(owner) ? owner.id + "/" : "app/") +
      "/projects/" +
      monitor.project_id +
      `/uptime/${monitor.monitor_id}`;
    const tz = (owner as any).tz ? (owner as any).tz : "Etc/GMT";
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
      url: baseUrl,
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
