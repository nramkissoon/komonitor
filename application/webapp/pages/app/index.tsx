import { PageLayout } from "../../src/common/components/Page-Layout";
import { AppIndexPage } from "../../src/modules/app-index-page/App-Index-Page";
import { ExtendedNextPage } from "../_app";

const Page: ExtendedNextPage = () => {
  return (
    <PageLayout isAppPage maxW={["sm", "xl", "3xl", "5xl", "6xl"]}>
      <AppIndexPage />
    </PageLayout>
  );
};

Page.requiresAuth = true;
export default Page;
