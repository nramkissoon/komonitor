import { Box, Divider, useColorModeValue } from "@chakra-ui/react";
import type { NextPage } from "next";
import { PageLayout } from "../src/common/components/Page-Layout";
import { Advanced } from "../src/modules/landing-page/Advanced";
import { Banner } from "../src/modules/landing-page/Banner";
import { CTA } from "../src/modules/landing-page/Cta";
import { Features } from "../src/modules/landing-page/Features";
import { IntegrationSection } from "../src/modules/landing-page/Integrations";
import { TeamsSection } from "../src/modules/landing-page/Team";

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
      full
      isAppPage={false}
      seoProps={{
        title: "Website Monitoring and Alerting",
        description:
          "Online Service for creating and managing monitors and alerts for your websites. Know when things go wrong before your customers even notice.",
      }}
    >
      <Banner />
      <Box
        maxW={["sm", "xl", "3xl", "5xl", "6xl", "1600px"]}
        display="flex"
        flexDir="column"
        m="auto"
        px={["10px", null, null, null, null, "20px"]}
      >
        <SectionDivider />
        <Features />

        <SectionDivider />
        <Advanced />
        <SectionDivider />
        <TeamsSection />
        <SectionDivider />
        <IntegrationSection />
        <SectionDivider />
        <CTA />
      </Box>
    </PageLayout>
  );
};

export default Home;
