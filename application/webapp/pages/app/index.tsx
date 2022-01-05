import { Alert, chakra, Flex } from "@chakra-ui/react";
import { PageLayout } from "../../src/common/components/Page-Layout";
import { AppIndexPage } from "../../src/modules/app-index-page/App-Index-Page";
import { ExtendedNextPage } from "../_app";

const Page: ExtendedNextPage = () => {
  return (
    <PageLayout
      isAppPage
      alert={
        <Alert variant="subtle" status="success" fontWeight="medium">
          <Flex
            width="100%"
            alignItems="center"
            justifyContent="center"
            flexDir="column"
          >
            <p>
              Whats New: We just launched Slack Alerts! Get alert messages
              delivered directly to your workspace!
            </p>
            <chakra.p mt="5px">
              Head over to Account Settings to integrate your Slack account!
            </chakra.p>
          </Flex>
        </Alert>
      }
    >
      <AppIndexPage />
    </PageLayout>
  );
};

Page.requiresAuth = true;
export default Page;
