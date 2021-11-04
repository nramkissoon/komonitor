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
    title: "Getting Started",
    path: "/docs/getting-started",
    heading: true,
    routes: [
      {
        title: "Overview",
        path: "/docs/getting-started/overview",
      },
    ],
  },
  {
    title: "Uptime Monitors",
    path: "/docs/uptime-monitors",
    heading: true,
    routes: [
      {
        title: "What is an Uptime Monitor?",
        path: "/docs/uptime-monitor/what-is-it",
      },
      {
        title: "Create a Monitor",
        path: "/docs/uptime-monitor/create-monitor",
      },
      {
        title: "Edit a Monitor",
        path: "/docs/uptime-monitor/edit-monitor",
      },
      {
        title: "Delete a Monitor",
        path: "/docs/uptime-monitor/delete-monitor",
      },
      {
        title: "Supported Regions",
        path: "/docs/uptime-monitor/supported-regions",
      },
      {
        title: "Quick Reference",
        path: "/docs/uptime-monitor/reference",
      },
    ],
  },
  {
    title: "Alerts",
    path: "/docs/alerts",
    heading: true,
    routes: [
      {
        title: "What is an Alert?",
        path: "/docs/alerts/what-is-it",
      },
      {
        title: "Create an Alert",
        path: "/docs/alerts/create-alert",
      },
      {
        title: "Edit an Alert",
        path: "/docs/alerts/edit-alert",
      },
      {
        title: "Delete an Alert",
        path: "/docs/alerts/delete-alert",
      },
      {
        title: "Disable an Alert",
        path: "/docs/alerts/disable-alert",
      },
      {
        title: "Alert Types",
        path: "/docs/alerts/alert-types",
      },
      {
        title: "Quick Reference",
        path: "/docs/alert/reference",
      },
    ],
  },
];
