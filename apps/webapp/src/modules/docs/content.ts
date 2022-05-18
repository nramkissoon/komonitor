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
    title: "Uptime Monitors",
    path: "/docs/uptime-monitor",
    heading: true,
    routes: [
      {
        title: "Uptime Monitor Intro",
        path: "/docs/uptime-monitor/intro",
      },
      {
        title: "Up Condition Checks",
        path: "/docs/uptime-monitor/up-condition-checks",
      },
    ],
  },
  {
    title: "Webhooks",
    path: "/docs/webhooks",
    heading: true,
    routes: [
      {
        title: "Getting Started",
        path: "/docs/webhooks/getting-started",
      },
      {
        title: "Uptime Monitor Statuses",
        path: "/docs/webhooks/uptime-monitor-status",
      },
      {
        title: "Alerts",
        path: "/docs/webhooks/alerts",
      },
    ],
  },
  {
    title: "Teams",
    path: "/docs/teams",
    heading: true,
    routes: [
      {
        title: "Permissions",
        path: "/docs/teams/permissions",
      },
    ],
  },
];
