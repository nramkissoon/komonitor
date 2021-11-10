import { PageLayout } from "../src/common/components/Page-Layout";
import { FaqPage } from "../src/modules/faq-page/Faq-Page";

export default function Faq() {
  return (
    <PageLayout
      isAppPage={false}
      seoProps={{
        title: "Frequently Asked Questions",
        description:
          "Komonitor is an online service for creating and managing monitors and alerts for your websites. Know when things go wrong and fix them before your customers even notice.",
      }}
    >
      <FaqPage />
    </PageLayout>
  );
}
