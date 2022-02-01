import { Divider, useColorModeValue } from "@chakra-ui/react";
import type { NextPage } from "next";
import { PageLayout } from "../src/common/components/Page-Layout";
import { Advanced } from "../src/modules/landing-page/Advanced";
import { Banner } from "../src/modules/landing-page/Banner";
import { ComingSoon } from "../src/modules/landing-page/Coming-Soon";
import { CTA } from "../src/modules/landing-page/Cta";
import { Features } from "../src/modules/landing-page/Features";
import { NoCode } from "../src/modules/landing-page/Nocode";

const SectionDivider = () => (
  <Divider
    maxW="md"
    margin="auto"
    borderWidth="1px"
    borderColor={useColorModeValue("blue.500", "blue.300")}
    mt="5em"
    mb=".8em"
  />
);

const Home: NextPage = () => {
  return (
    <PageLayout
      isAppPage={false}
      seoProps={{
        title: "Website Monitoring and Alerting",
        description:
          "Komonitor is an online service for creating and managing monitors and alerts for your websites. Know when things go wrong and fix them before your customers even notice.",
      }}
    >
      <Banner />
      <SectionDivider />
      <Features />
      <SectionDivider />
      <NoCode />
      <SectionDivider />
      <Advanced />
      <SectionDivider />
      <ComingSoon />
      <CTA />
    </PageLayout>
  );
};

export default Home;
