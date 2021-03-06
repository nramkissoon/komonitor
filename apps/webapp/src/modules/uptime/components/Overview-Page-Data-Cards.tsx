import {
  Box,
  Divider,
  Heading,
  ScaleFade,
  Spinner,
  Stat,
  StatGroup,
  StatLabel,
  StatNumber,
  useBreakpointValue,
  useColorModeValue,
} from "@chakra-ui/react";
import React from "react";
import { UptimeMonitorStatus } from "utils";
import { percentile } from "../../../common/utils";
import { sevenDaysAgo, thirtyDaysAgo, yesterday } from "../utils";

interface OverviewPageDataCardsProps {
  monitorId: string;
  statuses: UptimeMonitorStatus[] | undefined;
  since: number;
}

interface StatWithLoadingProps {
  label: string;
  stat: string | undefined;
}

const sinceToStringMap = {
  [yesterday]: "24H",
  [sevenDaysAgo]: "7-day",
  [thirtyDaysAgo]: "30-day",
};

function StatWithLoading(props: StatWithLoadingProps) {
  const { label, stat } = props;
  return (
    <Stat>
      <StatLabel fontSize="md" textAlign="center">
        {label}
      </StatLabel>
      {stat === undefined ? (
        <Spinner
          size="md"
          thickness="2px"
          speed=".8s"
          emptyColor={useColorModeValue("gray.200", "gray.700")}
          color={useColorModeValue("blue.300", "blue.300")}
        />
      ) : (
        <StatNumber textAlign="center">{stat}</StatNumber>
      )}
    </Stat>
  );
}

export function OverviewPageDataCards(props: OverviewPageDataCardsProps) {
  const { monitorId, statuses, since } = props;

  // divider orientation is not responsive so we will have to use this hack to hide/show the vertical when necessary
  const verticalDividerHidden = useBreakpointValue({ base: true, sm: false });

  let perc90, perc95, uptime;
  if (statuses && statuses.length !== 0) {
    let responseTimes = statuses.map((status) =>
      (status as any).latency // TODO revert latency status
        ? (status as any).latency
        : status.response.timings.phases.firstByte ?? -1
    );
    perc90 = percentile(responseTimes, 90);
    if (perc90 === -1) perc90 = "N/A";
    else {
      perc90 = perc90?.toFixed(2) + "ms";
    }
    perc95 = percentile(responseTimes, 95);
    if (perc95 === -1) perc95 = "N/A";
    else {
      perc95 = perc95?.toFixed(2) + "ms";
    }
    uptime =
      (
        (statuses.filter((status) => status.status === "up").length /
          statuses.length) *
        100
      ).toFixed(2) + "%";
  } else {
    perc90 = "No Data";
    perc95 = "No Data";
    uptime = "No Data";
  }

  return (
    <ScaleFade in={statuses !== undefined} initialScale={0.8}>
      <Box
        bg={useColorModeValue("white", "gray.950")}
        shadow="md"
        mb="2em"
        borderRadius="xl"
        py="1.5em"
      >
        <Heading textAlign="center" fontSize="xl" mb="1em">
          {sinceToStringMap[since]} Monitor Statistics
        </Heading>
        <StatGroup
          h={[null, "4em"]}
          display="flex"
          flexDirection={["column", "row"]}
          alignItems={["center", "flex-start"]}
        >
          <StatWithLoading label="P90 Response Time" stat={perc90} />
          <Divider
            orientation={"vertical"}
            borderColor="gray.500"
            hidden={verticalDividerHidden}
          />
          <Divider
            orientation={"horizontal"}
            borderColor="gray.300"
            hidden={!verticalDividerHidden}
            w="70%"
            my="1em"
          />
          <StatWithLoading label="P95 Response Time" stat={perc95} />
          <Divider
            orientation="vertical"
            borderColor="gray.500"
            hidden={verticalDividerHidden}
          />
          <Divider
            orientation={"horizontal"}
            borderColor="gray.300"
            hidden={!verticalDividerHidden}
            w="70%"
            my="1em"
          />
          <StatWithLoading label="Uptime" stat={uptime} />
        </StatGroup>
      </Box>
    </ScaleFade>
  );
}
