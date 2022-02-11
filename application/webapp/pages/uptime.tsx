import { chakra, Heading, useColorModeValue } from "@chakra-ui/react";
import { NextPage } from "next";
import { PageLayout } from "../src/common/components/Page-Layout";

const Page: NextPage = () => {
  return (
    <PageLayout
      isAppPage={false}
      seoProps={{
        title: "Website Uptime Monitoring",
        description:
          "Komonitor uptime monitors allow you to track your websites' and API uptime status by the minute.",
      }}
    >
      <Heading>
        Simple{" "}
        <chakra.span color={useColorModeValue("blue.500", "blue.300")}>
          Uptime Monitoring
        </chakra.span>
      </Heading>
      <chakra.section>
        We check on your websites and APIs and instantly alert you when
        something is wrong.
      </chakra.section>
    </PageLayout>
  );
};

export default Page;
