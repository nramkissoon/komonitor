import { Fade, Flex, Heading, Spacer, Text } from "@chakra-ui/react";
import React from "react";
import { LoadingSpinner } from "../../../src/common/components/Loading-Spinner";
import { PageLayout } from "../../../src/common/components/Page-Layout";
import {
  use24HourMonitorStatuses,
  useUptimeMonitors,
} from "../../../src/modules/uptime/client";
import { CreateButton } from "../../../src/modules/uptime/components/Create-Button";
import { OverviewTable } from "../../../src/modules/uptime/components/Overview-Table";
import { ExtendedNextPage } from "../../_app";

const Uptime: ExtendedNextPage = () => {
  let {
    monitors,
    isLoading: monitorsIsLoading,
    isError: monitorsIsError,
  } = useUptimeMonitors();
  let {
    statuses,
    isLoading: statusesIsLoading,
    isError: statusesIsError,
  } = use24HourMonitorStatuses(
    monitors ? monitors.map((monitor) => monitor.monitor_id) : []
  );

  return (
    <PageLayout isAppPage>
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
            monitors={monitors ? monitors : []}
            statusesMap={statusesIsLoading ? {} : statuses}
          />
        </Fade>
      )}
    </PageLayout>
  );
};

Uptime.requiresAuth = true;
export default Uptime;
