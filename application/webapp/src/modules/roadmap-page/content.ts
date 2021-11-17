interface Section {
  Header: string;
  Features: {
    completed: boolean;
    feature: string;
  }[];
}

export const Content: Section[] = [
  {
    Header: "Novemeber 2021",
    Features: [
      { completed: true, feature: "View data up to 30 days old." },
      { completed: false, feature: "User preferred timezone support." },
      { completed: false, feature: "Webhook alerts added as an alert type." },
    ],
  },
  {
    Header: "December 2021",
    Features: [
      { completed: false, feature: "Browser Monitors implemented." },
      { completed: false, feature: "Lighthouse Monitors implemented." },
      { completed: false, feature: "Slack and Discord alerts." },
      { completed: false, feature: "Launch! 🚀🚀🚀" },
    ],
  },
  {
    Header: "Early 2022",
    Features: [
      { completed: false, feature: "Komonitor API and SDK's shipped." },
    ],
  },
];
