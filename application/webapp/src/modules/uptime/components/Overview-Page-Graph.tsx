import {
  Box,
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
import { UptimeMonitorStatus } from "types";
import { LoadingSpinner } from "../../../common/components/Loading-Spinner";
import theme from "../../../common/components/theme";
import { use24HourMonitorStatuses } from "../client";

interface OverviewPageGraphProps {
  monitorId: string;
}

interface LineGraphProps {
  data: Serie;
  minLatency: number | null;
  maxLatency: number | null;
  colorMode: string;
}

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

function buildGraphSerie(statuses: UptimeMonitorStatus[], monitorId: string) {
  statuses.sort((a, b) => a.timestamp - b.timestamp);
  statuses = reduceArrayLength(statuses, 48);
  const serie: Serie = {
    id: monitorId,
    data: statuses.map((status) => {
      const dataPoint: Datum = {
        x: new Date(status.timestamp).toISOString(),
        y: status.latency,
      };
      return dataPoint;
    }),
  };
  return serie;
}

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
          Down Status
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

  const { data, minLatency, maxLatency, colorMode } = props;
  return (
    <ResponsiveLine
      data={[data]}
      margin={{ top: 5, right: 60, bottom: 100, left: 60 }}
      enableArea
      areaBaselineValue={Math.floor(minLatency as number)}
      colors={blue600}
      tooltip={(props) =>
        LineGraphTooltip(props.point.data.x, props.point.data.y)
      }
      motionConfig="stiff"
      curve="monotoneX"
      xScale={{ type: "point" }}
      yScale={{
        type: "linear",
        min: minLatency ? Math.floor(minLatency) : "auto",
        max: maxLatency ? Math.ceil(maxLatency) : "auto",
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
        legendOffset: -50,
        legendPosition: "middle",
      }}
      axisBottom={{
        tickSize: 5,
        tickPadding: 5,
        tickRotation: 45,
        legend: "Time (UTC)",
        legendOffset: 70,
        legendPosition: "middle",
        tickValues: data.data // every other tick
          .filter((value, i) => {
            return i % (data.data.length / 16) === 0; // ensures there are ~ 16 ticks on the graph
          })
          .map((d) => {
            return d.x;
          }),
        format: (v) => (v as string).slice(11, 19),
      }}
      enableGridX={false}
      enablePoints={true}
      pointLabelYOffset={-12}
      theme={graphTheme(colorMode === "dark")}
      useMesh
    />
  );
}

export function OverviewPageGraph(props: OverviewPageGraphProps) {
  const { monitorId } = props;
  const { statuses, isError, isLoading } = use24HourMonitorStatuses([
    monitorId,
  ]);

  const { colorMode } = useColorMode();

  const serie = React.useMemo(
    () => (statuses ? buildGraphSerie(statuses[monitorId], monitorId) : null),
    [monitorId, statuses]
  );
  const minLatency = React.useMemo(
    () =>
      serie !== null
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
      serie !== null
        ? (serie.data.reduce((prev, current) => {
            return (prev.y as DatumValue) >= (current.y as DatumValue)
              ? prev
              : current;
          }).y as number)
        : null,
    [serie]
  );

  return isLoading && !statuses && serie === null ? (
    <Fade in={isLoading} delay={0.2}>
      {LoadingSpinner()}
    </Fade>
  ) : (
    <ScaleFade in={!isLoading} initialScale={0.8}>
      <Box
        h="xl"
        bg={useColorModeValue("white", "#0f131a")}
        borderRadius="xl"
        p="1.5em"
        mb="2em"
        shadow="lg"
      >
        <Heading textAlign="center" fontSize="lg">
          Response Time (Past 24 Hours)
        </Heading>
        <LineGraph
          data={serie as Serie}
          minLatency={minLatency}
          maxLatency={maxLatency}
          colorMode={colorMode}
        />
      </Box>
    </ScaleFade>
  );
}
