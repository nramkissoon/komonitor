import { Fade, Flex, Heading, Spacer, Text } from "@chakra-ui/react";
import React from "react";
import { AppHeader } from "../../../src/common/components/App-Header";
import { LoadingSpinner } from "../../../src/common/components/Loading-Spinner";
import { PageContainer } from "../../../src/common/components/Page-Container";
import {
  use24HourMonitorStatuses,
  useUptimeMonitors,
} from "../../../src/modules/uptime/client";
import { CreateButton } from "../../../src/modules/uptime/components/Create-Button";
import { OverviewTable } from "../../../src/modules/uptime/components/Overview-Table";
import { ExtendedNextPage } from "../../_app";

const Uptime: ExtendedNextPage = () => {
  const {
    monitors,
    isLoading: monitorsIsLoading,
    isError: monitorsIsError,
  } = useUptimeMonitors();
  const {
    statuses,
    isLoading: statusesIsLoading,
    isError: statusesIsError,
  } = use24HourMonitorStatuses(
    monitors ? monitors.map((monitor) => monitor.monitor_id) : []
  );
  console.log(statuses);
  return (
    <>
      <Fade in={true}>
        <AppHeader />
      </Fade>
      <PageContainer>
        <Fade in={true}>
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
        </Fade>

        {monitorsIsLoading ? (
          <Fade in={monitorsIsLoading} delay={0.2}>
            {LoadingSpinner()}
          </Fade>
        ) : (
          <Fade in={!monitorsIsLoading}>
            <OverviewTable
              monitors={monitors}
              statusesMap={statusesIsLoading ? {} : statuses}
            />
          </Fade>
        )}
      </PageContainer>
    </>
  );
};

Uptime.requiresAuth = true;
export default Uptime;
