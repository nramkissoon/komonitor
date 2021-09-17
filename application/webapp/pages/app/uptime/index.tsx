import { Fade, Flex, Heading, Spacer, Text } from "@chakra-ui/react";
import React from "react";
import { AppHeader } from "../../../src/common/components/App-Header";
import { LoadingSpinner } from "../../../src/common/components/Loading-Spinner";
import { PageContainer } from "../../../src/common/components/Page-Container";
import { useUptimeMonitors } from "../../../src/modules/uptime/client";
import { CreateButton } from "../../../src/modules/uptime/components/Create-Button";
import { OverviewTable } from "../../../src/modules/uptime/components/Overview-Table";
import { ExtendedNextPage } from "../../_app";

const Uptime: ExtendedNextPage = () => {
  const { monitors, isLoading, isError } = useUptimeMonitors();
  return (
    <>
      <AppHeader />
      <PageContainer>
        <Flex mb="1.8em">
          <Heading size="lg" fontWeight="normal">
            Uptime Monitors{" "}
            <Text fontSize="sm" color="gray.500">
              (Last 24 hours)
            </Text>
          </Heading>
          <Spacer />
          <CreateButton />
        </Flex>
        {isLoading ? (
          <Fade in={isLoading} delay={0.2}>
            {LoadingSpinner()}
          </Fade>
        ) : (
          <Fade in={!isLoading}>
            <OverviewTable data={monitors} />
          </Fade>
        )}
      </PageContainer>
    </>
  );
};

Uptime.requiresAuth = true;
export default Uptime;
