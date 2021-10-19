import Email from "email-templates";
import { Alert, UptimeMonitor, UptimeMonitorStatus } from "project-types";
import { emailTransporter } from "./config";

export async function sendUptimeMonitorAlertEmail(
  monitor: UptimeMonitor,
  alert: Alert,
  statuses: UptimeMonitorStatus[]
): Promise<boolean> {
  // TEST
  console.log(`TEST EMAIL ALERT: ${monitor.monitor_id} - ${alert.alert_id}`);
  try {
    const email = new Email({
      message: {
        from: "no-reply@komonitor.com",
      },
      send: true,
      transport: emailTransporter,
    });
    const res = await email.send({
      template: "./email-templates/uptime",
      message: {
        to: alert.recipients,
      },
      locals: {
        severity: alert.severity,
        monitorName: monitor.name,
        alertName: alert.name,
      },
    });
    return true;
  } catch (err) {
    console.error(err);
    return false;
  }
}
