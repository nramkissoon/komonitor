import {
  Box,
  chakra,
  Flex,
  Heading,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useMemo } from "react";
import { ExtendedNextPage } from "../../../../../pages/_app";
import { useAppBaseRoute } from "../../../../common/client-utils";
import { AppSubNav } from "../../../../common/components/App-Sub-Nav";
import { LoadingSpinner } from "../../../../common/components/Loading-Spinner";
import { PageLayout } from "../../../../common/components/Page-Layout";
import { useAlertInvocationsAllTime } from "../../../alerts/client";
import {
  use24HourMonitorStatuses,
  useUptimeMonitorsForProject,
} from "../../../uptime/client";
import { OverviewPageSearchableGrid } from "../../../uptime/components/Overview-Page-Searchable-Grid";

const Overview: ExtendedNextPage = () => {
  const router = useRouter();
  const { projectId, teamId } = router.query;
  const baseRoute = useAppBaseRoute();

  const { monitors: data, isLoading: monitorsIsLoading } =
    useUptimeMonitorsForProject(projectId as string);

  const monitors = data ? data[projectId as string] : [];

  const { statuses, isLoading: statusesIsLoading } = use24HourMonitorStatuses(
    monitors.map((m) => m.monitor_id)
  );

  let totalDownMonitors = 0;
  if (statuses) {
    for (let id of Object.keys(statuses)) {
      if (statuses[id].length > 0 && statuses[id][0].status === "down") {
        totalDownMonitors = totalDownMonitors + 1;
      }
    }
  }

  const { invocations, isLoading: invocationsIsLoading } =
    useAlertInvocationsAllTime(monitors.map((m) => m.monitor_id));

  const uptimeMonitorIdsWithOngoingAlerts: string[] = [];

  if (invocations) {
    for (let id of Object.keys(invocations)) {
      if (invocations[id].length > 0 && invocations[id][0].ongoing) {
        uptimeMonitorIdsWithOngoingAlerts.push(id);
      }
    }
  }

  const monitorsWithOngoingAlerts = useMemo(() => {
    let monitorsWithOngoingAlerts = [];
    for (let monitor of monitors) {
      if (uptimeMonitorIdsWithOngoingAlerts.includes(monitor.monitor_id)) {
        monitorsWithOngoingAlerts.push(monitor);
      }
    }
    return monitorsWithOngoingAlerts;
  }, [uptimeMonitorIdsWithOngoingAlerts]);

  const viewMonitorLinkColor = useColorModeValue("blue.500", "blue.300");
  const viewMonitorLinkColorHover = useColorModeValue("blue.600", "blue.500");

  return (
    <PageLayout isAppPage>
      <AppSubNav
        links={[
          {
            isSelected: true,
            href: baseRoute + "/projects/" + projectId,
            text: "Overview",
          },
          {
            isSelected: false,
            href: baseRoute + "/projects/" + projectId + "/uptime",
            text: "Uptime Monitors",
          },
          {
            isSelected: false,
            href: baseRoute + "/projects/" + projectId + "/settings",
            text: "Project Settings",
          },
        ]}
      />
      {monitorsIsLoading && <LoadingSpinner />}
      {!monitorsIsLoading && (
        <>
          <Heading
            textAlign="left"
            fontWeight="medium"
            mb=".2em"
            fontSize="2xl"
          >
            {projectId}
          </Heading>
          <Heading
            textAlign="left"
            fontWeight="normal"
            mb="1em"
            fontSize="lg"
            color="gray.500"
          >
            Project Overview (Last 24 Hours)
          </Heading>
          {monitorsWithOngoingAlerts.length > 0 && (
            <Box mb="20px">
              <Box
                fontSize="xl"
                fontWeight={"medium"}
                letterSpacing="wide"
                mb="10px"
                position="relative"
                display="inline-flex"
              >
                Ongoing Issues{" "}
                <span className="absolute top-0 right-0 flex w-3 h-3 -mt-[2px] -mr-4">
                  <span className="absolute inline-flex w-full h-full bg-red-500 rounded-full opacity-75 animate-ping" />
                  <span className="relative inline-flex w-3 h-3 bg-red-500 rounded-full"></span>
                </span>
              </Box>
              {monitorsWithOngoingAlerts.map((monitor) => (
                <Flex
                  key={`${monitor.monitor_id}-ongoing-alert`}
                  pb="10px"
                  fontSize="large"
                  flexDir="column"
                >
                  <Box>
                    Uptime monitor:{" "}
                    <chakra.span fontWeight="medium" letterSpacing="wide">
                      {monitor.name}
                    </chakra.span>{" "}
                    <chakra.span color={"gray.500"}>
                      ({monitor.url})
                    </chakra.span>{" "}
                    is in alert.
                  </Box>
                  <Box
                    color={viewMonitorLinkColor}
                    w="fit-content"
                    _hover={{
                      color: viewMonitorLinkColorHover,
                    }}
                  >
                    <Link
                      href={
                        baseRoute +
                        "/projects/" +
                        projectId +
                        "/uptime/" +
                        monitor.monitor_id
                      }
                    >
                      View monitor
                    </Link>
                  </Box>
                </Flex>
              ))}
            </Box>
          )}
          <Text
            fontSize="xl"
            fontWeight={"medium"}
            letterSpacing="wide"
            mb="10px"
          >
            Uptime Monitors
          </Text>
          <OverviewPageSearchableGrid limit={6} includeCreateButton />
        </>
      )}
    </PageLayout>
  );
};

Overview.requiresAuth = true;
export default Overview;
