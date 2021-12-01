export type UptimeCheckSupportedFrequenciesInMinutes =
  | 1
  | 5
  | 15
  | 30
  | 60
  | 180
  | 360
  | 720
  | 1440;

// Monitor types offered by service
export type MonitorTypes =
  | "uptime-monitor"
  | "lighthouse-monitor"
  | "browser-monitor";

export type ItemTypes = MonitorTypes | "alert" | "alert-invocation";
