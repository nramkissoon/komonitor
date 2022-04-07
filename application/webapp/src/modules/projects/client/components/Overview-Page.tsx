import { ExternalLinkIcon, SearchIcon } from "@chakra-ui/icons";
import {
  Badge,
  Box,
  Button,
  chakra,
  Flex,
  Grid,
  GridItem,
  Heading,
  Input,
  InputGroup,
  InputLeftElement,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import Fuse from "fuse.js";
import { uniqueId } from "lodash";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useMemo } from "react";
import { UptimeMonitorStatus, UptimeMonitorWithStatuses } from "utils";
import { ExtendedNextPage } from "../../../../../pages/_app";
import {
  regionToLocationStringMap,
  timeAgo,
  useAppBaseRoute,
} from "../../../../common/client-utils";
import { AppSubNav } from "../../../../common/components/App-Sub-Nav";
import { LoadingSpinner } from "../../../../common/components/Loading-Spinner";
import { PageLayout } from "../../../../common/components/Page-Layout";
import { useAlertInvocationsAllTime } from "../../../alerts/client";
import { useTeam } from "../../../teams/client";
import {
  use24HourMonitorStatuses,
  useUptimeMonitorsForProject,
} from "../../../uptime/client";
import { useProjects } from "../client";

const getUptimeBarVisualValues = (
  statuses: UptimeMonitorStatus[] | undefined
) => {
  if (!statuses) return;

  let values = [];
  if (statuses.length >= 100) {
    let chunkSize = Math.floor(statuses.length / 100);
    for (let i = statuses.length - 1; i >= 0; i -= chunkSize) {
      const chunk = statuses.slice(i, i - chunkSize);
      let value = "up";
      chunk.forEach((status) => {
        if (status.status === "down") {
          value = "down";
        } else if (status.status === "paused" && value !== "down") {
          value = "paused";
        }
      });
      values.push(value);
    }
  } else {
    for (let i = statuses.length - 1; i >= 0; i -= 1) {
      if (statuses[i].status === "down") {
        values.push("down");
      } else if (statuses[i].status === "paused") {
        values.push("paused");
      } else {
        values.push("up");
      }
    }
  }
  return values;
};

const Overview: ExtendedNextPage = () => {
  const router = useRouter();
  const { projectId, teamId } = router.query;
  const { projects, projectsIsLoading, projectsFetchError } = useProjects();
  const { team } = useTeam(teamId as string);
  const baseRoute = useAppBaseRoute();

  if (projects) {
    if (!projects.find((project) => project.project_id === projectId)) {
      router.push(team ? "/" + team : "/app");
    }
  }

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

  const monitorsWithStatuses: (UptimeMonitorWithStatuses & {
    currentStatus?: string;
    readableRegion?: string;
  })[] = monitors.map((m) => ({
    ...m,
    statuses: statuses ? statuses[m.monitor_id] ?? undefined : undefined,
    currentStatus: statuses ? statuses[m.monitor_id]?.[0]?.status : undefined,
    readableRegion: regionToLocationStringMap[m.region],
  }));

  const [uptimeMonitorSearchQuery, setUptimeMonitorSearchQuery] =
    React.useState("");
  const fuse = new Fuse(monitorsWithStatuses, {
    keys: [
      "url",
      "name",
      "region",
      "frequency",
      "paused",
      "currentStatus",
      "readableRegion",
    ],
  });

  const viewMonitorLinkColor = useColorModeValue("blue.500", "blue.300");
  const viewMonitorLinkColorHover = useColorModeValue("blue.600", "blue.500");
  const cardBgColor = useColorModeValue("white", "gray.950");
  const cardBorderColor = useColorModeValue("gray.300", "whiteAlpha.300");

  const uptimeMonitorSearchQueryResults = fuse.search(
    uptimeMonitorSearchQuery === "" ? "https" : uptimeMonitorSearchQuery, // default to showing all monitors if no query
    { limit: 9 }
  );

  const colorBarMap: { [key: string]: string } = {
    up: useColorModeValue("green.400", "green.600"),
    paused: useColorModeValue("gray.400", "gray.600"),
    down: useColorModeValue("red.400", "red.600"),
  };

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
          <Flex mt="3">
            <InputGroup mr="1em">
              <InputLeftElement
                pointerEvents="none"
                children={<SearchIcon color="gray.300" />}
              />
              <Input
                shadow="sm"
                placeholder={`Search ${monitors.length} uptime monitors...`}
                background={cardBgColor}
                value={uptimeMonitorSearchQuery}
                onChange={(e) => setUptimeMonitorSearchQuery(e.target.value)}
              />
            </InputGroup>
            <Link
              href={
                baseRoute +
                "/projects/" +
                projectId +
                "/uptime?createMonitor=true"
              }
              passHref
            >
              <Button
                fontWeight="normal"
                px="6"
                fontSize={["md", null, null, "lg"]}
                shadow="sm"
                colorScheme="blue"
                bgColor="blue.400"
                color="white"
                _hover={{
                  bg: "blue.600",
                }}
              >
                {"Create a Monitor"}
              </Button>
            </Link>
          </Flex>
          <Grid
            templateColumns={[
              "repeat(1, 1fr)",
              null,
              null,
              "repeat(2, 1fr)",
              null,
              "repeat(3, 1fr)",
            ]}
            gap={5}
            my="5"
          >
            {uptimeMonitorSearchQueryResults.map((res) => {
              const barValues = getUptimeBarVisualValues(
                res.item.statuses ?? undefined
              );
              return (
                <GridItem key={res.item.monitor_id} h="full">
                  <Grid
                    templateColumns={["repeat(1, 1fr)"]}
                    p={4}
                    bg={cardBgColor}
                    rounded="md"
                    border="1px"
                    borderColor={cardBorderColor}
                    gap={3}
                    h="full"
                  >
                    <GridItem>
                      <Flex flexDir="column">
                        <Box
                          fontSize="lg"
                          fontWeight="medium"
                          letterSpacing="wide"
                          mb="5px"
                        >
                          {res.item.name}
                        </Box>
                        <Box
                          color={"gray.500"}
                          _hover={{
                            color: "blue.500",
                          }}
                          w="fit-content"
                          wordBreak="break-all"
                        >
                          <chakra.a
                            href={res.item.url}
                            target="_blank"
                            rel="noreferrer"
                          >
                            {res.item.url}
                          </chakra.a>
                          <ExternalLinkIcon ml="5px" mt="-3px" />
                        </Box>
                        <Box color={"gray.500"}>
                          {regionToLocationStringMap[res.item.region]}
                        </Box>
                      </Flex>
                    </GridItem>
                    {barValues && (
                      <GridItem>
                        <Grid
                          templateColumns={`repeat(${barValues.length}, 1fr)`}
                        >
                          {barValues.map((value) => {
                            return (
                              <Box
                                bg={colorBarMap[value]}
                                h="2px"
                                key={uniqueId()}
                              ></Box>
                            );
                          })}
                        </Grid>
                      </GridItem>
                    )}
                    <GridItem alignSelf="end">
                      <Flex
                        flexDir="row"
                        h="full"
                        justifyContent="space-between"
                      >
                        <Flex flexDir="row" gap={3}>
                          <Badge
                            w="fit-content"
                            fontSize="lg"
                            fontWeight="normal"
                            mb="5px"
                            colorScheme={
                              res.item.currentStatus === "up"
                                ? "green"
                                : res.item.currentStatus === "down"
                                ? "red"
                                : "gray"
                            }
                          >
                            {res.item.currentStatus ?? "Loading..."}
                          </Badge>
                          <Box mt="2px">
                            {res.item.statuses
                              ? timeAgo.format(res.item.statuses[0].timestamp)
                              : "unknown"}
                          </Box>
                        </Flex>
                        <Box
                          mt="2px"
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
                              res.item.monitor_id
                            }
                          >
                            View monitor
                          </Link>
                        </Box>
                      </Flex>
                    </GridItem>
                  </Grid>
                </GridItem>
              );
            })}
          </Grid>
        </>
      )}
    </PageLayout>
  );
};

Overview.requiresAuth = true;
export default Overview;
