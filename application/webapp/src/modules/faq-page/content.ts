interface Faq {
  question: string;
  answer: string;
}

export const FaqPageContent: Faq[] = [
  {
    question: "Do you offer a free trial?",
    answer:
      "Yes! By creating an account you are automatically given access to our free-tier service.",
  },
  {
    question:
      "I need to create a lot of monitors, are the limits on my account fixed?",
    answer:
      "If you are on a paid tier, please contact us and we'll raise the limits on your account to match your needs.",
  },
  {
    question: "Can I cancel any time?",
    answer:
      "Of course! No questions asked. When you delete your account in the settings page, any data related to you will also be deleted.",
  },
  {
    question:
      "Do you offer an API so that I do not need to manually manage my monitors?",
    answer:
      "Komonitor was built as a no-code monitoring tool. However, we are developing an API for our power-users to consume. We'll keep you updated on our roadmap page.",
  },
  {
    question: "What is the 'complimentary setup' offered for paid plans?",
    answer:
      "If you don't have the time to setup your monitors and alerting system, you can contact us and we'll do it for you, free of any extra charge.",
  },
  {
    question: "What is the meaning of life?",
    answer:
      "We don't know. What we do know is that effective monitoring allows you to spend more of your life enjoying it rather than worrying about your websites going down unnoticed 😉.",
  },
];
