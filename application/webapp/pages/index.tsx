import { Alert, Flex } from "@chakra-ui/react";
import type { NextPage } from "next";
import { PageLayout } from "../src/common/components/Page-Layout";
import { Banner } from "../src/modules/landing-page/Banner";
import { ComingSoon } from "../src/modules/landing-page/Coming-Soon";
import { CTA } from "../src/modules/landing-page/Cta";
import { Features } from "../src/modules/landing-page/Features";
import { NoCode } from "../src/modules/landing-page/Nocode";

const Home: NextPage = () => {
  return (
    <PageLayout
      isAppPage={false}
      seoProps={{
        title: "Website Monitoring and Alerting",
        description:
          "Komonitor is an online service for creating and managing monitors and alerts for your websites. Know when things go wrong and fix them before your customers even notice.",
      }}
      alert={
        <Alert variant="subtle" status="success" fontWeight="medium">
          <Flex width="100%" alignItems="center" justifyContent="center">
            <p>
              Whats New: We just launched Slack Alerts! Get alert messages
              delivered directly to your workspace!
            </p>
          </Flex>
        </Alert>
      }
    >
      <Banner />
      <Features />
      <NoCode />

      <ComingSoon />
      <CTA />
    </PageLayout>
  );
};

export default Home;
