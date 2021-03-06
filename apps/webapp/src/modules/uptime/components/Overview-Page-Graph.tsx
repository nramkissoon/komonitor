import {
  Box,
  Center,
  chakra,
  Fade,
  Heading,
  ScaleFade,
  Text,
  useColorMode,
  useColorModeValue,
  useToken,
} from "@chakra-ui/react";
import { Theme } from "@nivo/core";
import { Datum, DatumValue, ResponsiveLine, Serie } from "@nivo/line";
import React from "react";
import { UptimeMonitorStatus } from "utils";
import { getTimeString } from "../../../common/client-utils";
import { LoadingSpinner } from "../../../common/components/Loading-Spinner";
import theme from "../../../common/components/theme";
import { sevenDaysAgo, thirtyDaysAgo, yesterday } from "../utils";

export interface OverviewPageGraphProps {
  monitorId: string;
  statuses: UptimeMonitorStatus[] | undefined;
  since: number;
  tzOffset: number;
}

interface LineGraphProps {
  data: Serie;

  // min and max latencies are used to define graph axis limits
  minLatency: number | null;
  maxLatency: number | null;
  colorMode: string; // dark or light
  offset: number;
}

const sinceToStringMap = {
  [yesterday]: "(Past 24 Hours)",
  [sevenDaysAgo]: "(Past 7 Days)",
  [thirtyDaysAgo]: "(Past 30 Days)",
};

// use the chakra theme to style graph based on already defined colors
function graphTheme(dark: boolean): Theme {
  const chakraTheme = theme;

  return {
    crosshair: {
      line: {
        stroke: (dark
          ? chakraTheme.colors.gray["100"]
          : chakraTheme.colors.gray["900"]) as string,
      },
    },
    fontSize: 14,
    textColor: (dark
      ? chakraTheme.colors.gray["100"]
      : chakraTheme.colors.gray["700"]) as string,
    grid: {
      line: {
        strokeWidth: 1,
        stroke: (dark
          ? chakraTheme.colors.gray["700"]
          : chakraTheme.colors.gray["200"]) as string,
      },
    },
    axis: {
      legend: {
        text: {
          fontSize: 14,
          fontWeight: "bold",
        },
      },
      domain: {
        line: {
          strokeWidth: 1,
          stroke: (dark
            ? chakraTheme.colors.gray["700"]
            : chakraTheme.colors.gray["200"]) as string,
        },
      },
      ticks: {
        line: {
          strokeWidth: 2,
          stroke: (dark
            ? chakraTheme.colors.gray["700"]
            : chakraTheme.colors.gray["200"]) as string,
        },
      },
    },
  };
}

// reduces an array to a desired length by removing elements evenly
function reduceArrayLength(array: any[], desiredLength: number) {
  if (desiredLength >= array.length / 2 + 1) return array;
  let factor = Math.floor(array.length / desiredLength) + 1;
  factor = desiredLength % 2 === 0 ? --factor : factor;
  let result = [];
  for (let i = 0; i < array.length; i = i + factor) {
    result.push(array[i]);
  }
  return result;
}

function buildGraphSerie(
  statuses: UptimeMonitorStatus[],
  monitorId: string,
  offset: number
) {
  statuses.sort((a, b) => a.timestamp - b.timestamp);
  statuses = reduceArrayLength(statuses, 48);
  const serie: Serie = {
    id: monitorId,
    data: statuses.map((status) => {
      const dataPoint: Datum = {
        x: getTimeString(offset, status.timestamp),
        y: (status as any).latency // TODO revert latency status
          ? (status as any).latency
          : status.response.timings.phases.firstByte ?? -1,
      };
      return dataPoint;
    }),
  };
  return serie;
}

// Tooltip that is displayed whenever point on graph is hovered over
function LineGraphTooltip(x: DatumValue, y: DatumValue) {
  const yRounded = (y as number).toFixed(2);
  return (
    <Box
      zIndex={100}
      bg={useColorModeValue("gray.50", "gray.900")}
      p=".7em"
      borderRadius="md"
      shadow="md"
    >
      <Text fontWeight="semibold">
        x: <chakra.span fontWeight="normal">{x.toString()}</chakra.span>
      </Text>

      {yRounded === "-1.00" ? (
        <Text fontWeight="semibold" textColor="red.500">
          No Response - Down Status
        </Text>
      ) : (
        <Text fontWeight="semibold">
          y:{" "}
          <chakra.span fontWeight="normal">{yRounded.toString()}ms</chakra.span>
        </Text>
      )}
    </Box>
  );
}

function LineGraph(props: LineGraphProps) {
  const [blue600] = useToken("colors", ["blue.600"]);

  const { data, minLatency, maxLatency, colorMode, offset } = props;

  let offsetString = "";
  if (offset > 0) {
    offsetString = "+" + offset;
  } else if (offset < 0) {
    offsetString = offset.toString();
  }

  return (
    <ResponsiveLine
      animate={true}
      data={[data]}
      margin={{ top: 5, right: 60, bottom: 100, left: 70 }}
      enableArea
      areaBaselineValue={Math.floor(minLatency as number)}
      colors={blue600}
      tooltip={(props) =>
        LineGraphTooltip(props.point.data.x, props.point.data.y)
      }
      motionConfig="slow"
      curve="monotoneX"
      xScale={{ type: "point" }}
      yScale={{
        type: "linear",
        min: minLatency ? Math.floor(minLatency) : "auto",
        max: maxLatency ? Math.ceil(maxLatency * 3) : "auto",
        stacked: true,
        reverse: false,
      }}
      yFormat=" >-.2f"
      axisTop={null}
      axisRight={null}
      axisLeft={{
        tickSize: 5,
        tickPadding: 5,
        tickRotation: 0,
        legend: "Response Time (ms)",
        legendOffset: -60,
        legendPosition: "middle",
      }}
      axisBottom={{
        tickSize: 5,
        tickPadding: 5,
        tickRotation: 45,
        legend: `Time (UTC${offsetString})`,
        legendOffset: 80,
        legendPosition: "middle",
        tickValues:
          data.data.length <= 12
            ? data.data.map((d) => {
                return d.x; // do nothing, less than or eq 12 data points anyways
              })
            : data.data // every other tick
                .filter((value, i) => {
                  return i % 4 === 0; // ensures there are ~ 12 ticks on the graph
                })
                .map((d) => {
                  return d.x;
                }),
        format: (v) => (v as string).slice((v as string).length - 11),
      }}
      enableGridX={false}
      enablePoints={false}
      pointLabelYOffset={-12}
      theme={graphTheme(colorMode === "dark")}
      useMesh
    />
  );
}

export function OverviewPageGraph(props: OverviewPageGraphProps) {
  let { monitorId, statuses, since, tzOffset } = props;

  const { colorMode } = useColorMode();

  // Filter out failures where no response
  const filteredStatuses = statuses ? statuses : null;

  // memos for graph attributes
  const serie = React.useMemo(
    () =>
      filteredStatuses
        ? buildGraphSerie(filteredStatuses, monitorId, tzOffset)
        : null,
    [monitorId, statuses, since, tzOffset]
  );
  const minLatency = React.useMemo(
    () =>
      serie !== null && serie.data.length !== 0
        ? (serie.data.reduce((prev, current) => {
            return (prev.y as DatumValue) < (current.y as DatumValue)
              ? prev
              : current;
          }).y as number)
        : null,
    [serie]
  );
  const maxLatency = React.useMemo(
    () =>
      serie !== null && serie.data.length !== 0
        ? (serie.data.reduce((prev, current) => {
            return (prev.y as DatumValue) >= (current.y as DatumValue)
              ? prev
              : current;
          }).y as number)
        : null,
    [serie]
  );

  return !statuses && serie === null ? (
    <Fade in={!statuses} delay={0.2}>
      {LoadingSpinner()}
    </Fade>
  ) : (
    <ScaleFade in={statuses !== undefined} initialScale={0.8}>
      <Box
        h="md"
        bg={useColorModeValue("white", "gray.950")}
        borderRadius="xl"
        p="1.5em"
        mb="3em"
        shadow="lg"
      >
        <Heading textAlign="center" fontSize="lg">
          Response Time {sinceToStringMap[since]}
        </Heading>
        {serie?.data.length === 0 ? (
          <Center mt="3em">
            <Heading>No Data</Heading>
          </Center>
        ) : (
          <>
            <LineGraph
              data={serie as Serie}
              minLatency={minLatency}
              maxLatency={maxLatency}
              colorMode={colorMode}
              offset={tzOffset}
            />
            <Text mt=".3em" color="red.400">
              *Subset of data points are displayed on graph for legibility
            </Text>
          </>
        )}
      </Box>
    </ScaleFade>
  );
}
