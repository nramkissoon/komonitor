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
import { percentile } from "../../../common/utils";
import { use24HourMonitorStatuses } from "../client";

interface OverviePageDataCardsProps {
  monitorId: string;
}

interface StatWithLoadingProps {
  label: string;
  stat: string | undefined;
}

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

export function OverviewPageDataCards(props: OverviePageDataCardsProps) {
  const { monitorId } = props;
  const { statuses, isLoading, isError } = use24HourMonitorStatuses([
    monitorId,
  ]);

  // divider orientation is not responsive so we will have to use this hack to hide/show the vertical when necessary
  const verticalDividerHidden = useBreakpointValue({ base: true, sm: false });

  let perc90, perc95, uptime;
  if (statuses && !isLoading) {
    let responseTimes = statuses[monitorId].map((status) => status.latency);
    perc90 = percentile(responseTimes, 90)?.toFixed(2) + "ms";
    perc95 = percentile(responseTimes, 95)?.toFixed(2) + "ms";
    uptime =
      (
        (statuses[monitorId].filter((status) => status.status === "up").length /
          statuses[monitorId].length) *
        100
      ).toFixed(2) + "%";
  }

  return (
    <ScaleFade in={!isLoading} initialScale={0.8}>
      <Box
        bg={useColorModeValue("white", "#0f131a")}
        shadow="md"
        mb="2em"
        borderRadius="xl"
        py="1.5em"
      >
        <Heading textAlign="center" fontSize="xl" mb="1em">
          24H Monitor Statistics
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
