import { ExternalLinkIcon, SearchIcon } from "@chakra-ui/icons";
import {
  Badge,
  Box,
  Button,
  chakra,
  Flex,
  Grid,
  GridItem,
  Input,
  InputGroup,
  InputLeftElement,
  useColorModeValue,
} from "@chakra-ui/react";
import Fuse from "fuse.js";
import { uniqueId } from "lodash";
import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";
import { UptimeMonitorStatus, UptimeMonitorWithStatuses } from "utils";
import {
  regionToLocationStringMap,
  timeAgo,
  useAppBaseRoute,
} from "../../../common/client-utils";
import { LoadingSpinner } from "../../../common/components/Loading-Spinner";
import {
  use24HourMonitorStatuses,
  useUptimeMonitorsForProject,
} from "../client";

const getUptimeBarVisualValues = (
  statuses: UptimeMonitorStatus[] | undefined
) => {
  if (!statuses || statuses.length === 0) return Array(100).fill("paused");

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

export const OverviewPageSearchableGrid = ({
  limit,
  includeCreateButton,
}: {
  limit: number;
  includeCreateButton: boolean;
}) => {
  const baseRoute = useAppBaseRoute();
  const router = useRouter();
  const { projectId } = router.query;

  const { monitors: data, isLoading: monitorsIsLoading } =
    useUptimeMonitorsForProject(projectId as string);

  const monitors = data ? data[projectId as string] : [];

  const { statuses, isLoading: statusesIsLoading } = use24HourMonitorStatuses(
    monitors.map((m) => m.monitor_id)
  );

  const monitorsWithStatuses: (UptimeMonitorWithStatuses & {
    currentStatus?: string;
    readableRegion?: string;
  })[] = monitors
    .map((m) => ({
      ...m,
      statuses: statuses ? statuses[m.monitor_id] ?? undefined : undefined,
      currentStatus: statuses ? statuses[m.monitor_id]?.[0]?.status : undefined,
      readableRegion: regionToLocationStringMap[m.region],
    }))
    .sort((a, b) => b.created_at - a.created_at);

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
    { limit: Math.min(limit, 10) }
  );

  const colorBarMap: { [key: string]: string } = {
    up: useColorModeValue("green.400", "green.600"),
    paused: useColorModeValue("gray.400", "gray.600"),
    down: useColorModeValue("red.400", "red.600"),
  };

  return (
    <>
      {monitorsIsLoading && <LoadingSpinner />}
      {!monitorsIsLoading && (
        <>
          <Flex mt="3">
            <InputGroup>
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
            {includeCreateButton && (
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
                  ml="1em"
                >
                  {"Create a Monitor"}
                </Button>
              </Link>
            )}
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
                            {res.item.currentStatus ?? "Pending..."}
                          </Badge>
                          <Box mt="2px">
                            {res.item.statuses && res.item.statuses.length > 0
                              ? timeAgo.format(res.item.statuses[0].timestamp)
                              : ""}
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
    </>
  );
};
