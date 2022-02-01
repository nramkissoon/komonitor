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
    ],
  },
];
