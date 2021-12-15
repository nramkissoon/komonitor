interface SidebarRouteSection {
  title: string;
  path: string;
  heading: boolean;
  routes: {
    title: string;
    path: string;
  }[];
}

export const SidebarRoutes: SidebarRouteSection[] = [
  {
    title: "🚀 Getting Started",
    path: "/docs/getting-started",
    heading: true,
    routes: [
      {
        title: "Introduction",
        path: "/docs/getting-started/introduction",
      },
      {
        title: "Quick Start Guide",
        path: "/docs/getting-started/quick-start",
      },
      {
        title: "Support",
        path: "/docs/getting-started/support",
      },
    ],
  },
  {
    title: "✅ Uptime Monitors",
    path: "/docs/uptime-monitors",
    heading: true,
    routes: [
      {
        title: "What is an Uptime Monitor?",
        path: "/docs/uptime-monitor/what-is-it",
      },
      {
        title: "Working with Uptime Monitors",
        path: "/docs/uptime-monitor/working-with-uptime-monitors",
      },
      {
        title: "Supported Regions",
        path: "/docs/uptime-monitor/supported-regions",
      },
    ],
  },
  {
    title: "🚨 Alerts",
    path: "/docs/alerts",
    heading: true,
    routes: [
      {
        title: "What is an Alert?",
        path: "/docs/alerts/what-is-it",
      },
      {
        title: "Working with Alerts",
        path: "/docs/alerts/working-with-alerts",
      },
    ],
  },
];
