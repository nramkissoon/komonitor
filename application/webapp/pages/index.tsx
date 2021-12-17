import { Box, useColorModeValue } from "@chakra-ui/react";
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
      alert={
        <Box
          w="100%"
          textAlign="center"
          bg={useColorModeValue("green.100", "green.500")}
          py="3px"
        >
          <b>Big announcement! Komonitor has launched!</b> 🎉🎉🎉
        </Box>
      }
      isAppPage={false}
      seoProps={{
        title: "Website Monitoring and Alerting",
        description:
          "Komonitor is an online service for creating and managing monitors and alerts for your websites. Know when things go wrong and fix them before your customers even notice.",
      }}
    >
      <Banner />
      <NoCode />
      <Features />
      <ComingSoon />
      <CTA />
    </PageLayout>
  );
};

export default Home;
