import {
  Box,
  Divider,
  useColorModeValue,
  useMediaQuery,
} from "@chakra-ui/react";
import type { NextPage } from "next";
import { FadeInView } from "../src/common/components/Animation";
import { PageLayout } from "../src/common/components/Page-Layout";
import { Advanced } from "../src/modules/landing-page/Advanced";
import { Banner } from "../src/modules/landing-page/Banner";
import { CTA } from "../src/modules/landing-page/Cta";
import { Features } from "../src/modules/landing-page/Features";
import { IntegrationSection } from "../src/modules/landing-page/Integrations";
import { TeamsSection } from "../src/modules/landing-page/Team";

const SectionDivider = () => (
  <FadeInView
    obvProps={{ threshold: 1, rootMargin: "0px 0px 0px 0px" }}
    inAnimation="motion-safe:animate-scale-fade-in"
    outAnimation="motion-safe:animate-scale-fade-out"
  >
    <Divider
      maxW="md"
      margin="auto"
      borderWidth="1px"
      borderColor={useColorModeValue("blue.500", "blue.300")}
      mt="5em"
      mb=".8em"
    />
  </FadeInView>
);

const Home: NextPage = () => {
  const [isLargerThanHD, isDisplayingInBrowser] = useMediaQuery([
    "(min-width: 1920px)",
    "(display-mode: browser)",
  ]);
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
      <Box display="flex" flexDir="column" m="auto" overflowX="hidden" w="full">
        <SectionDivider />
        <Features />
      </Box>
      <Box
        maxW={["sm", "xl", "3xl", "5xl", "6xl", "1600px"]}
        display="flex"
        flexDir="column"
        m="auto"
        px={["10px", null, null, null, null, "20px"]}
      >
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
