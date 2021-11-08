import { PageLayout } from "../src/common/components/Page-Layout";
import { FaqPage } from "../src/modules/faq-page/Faq-Page";

export default function Faq() {
  return (
    <PageLayout isAppPage={false}>
      <FaqPage />
    </PageLayout>
  );
}
