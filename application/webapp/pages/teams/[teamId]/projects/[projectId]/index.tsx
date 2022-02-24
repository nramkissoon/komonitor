import {
  Box,
  Flex,
  Grid,
  GridItem,
  Heading,
  useColorModeValue,
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import React from "react";
import { Column } from "react-table";
import { UptimeMonitorWithStatuses } from "utils";
import {
  regionToLocationStringMap,
  timeAgo,
} from "../../../../../src/common/client-utils";
import { AppSubNav } from "../../../../../src/common/components/App-Sub-Nav";
import { LoadingSpinner } from "../../../../../src/common/components/Loading-Spinner";
import { CommonOverviewTable } from "../../../../../src/common/components/Overview-Table";
import { PageLayout } from "../../../../../src/common/components/Page-Layout";
import { useTeam } from "../../../../../src/common/components/TeamProvider";
import { useAlertInvocationsAllTime } from "../../../../../src/modules/alerts/client";
import { useProjects } from "../../../../../src/modules/projects/client/client";
import {
  use24HourMonitorStatuses,
  useUptimeMonitorsForProject,
} from "../../../../../src/modules/uptime/client";
import {
  DescriptionCell,
  ResponseCell,
  StatusCell,
} from "../../../../../src/modules/uptime/components/Table-Cell";
import { createMonitorDataWithStatus } from "../../../../../src/modules/uptime/utils";
import { ExtendedNextPage } from "../../../../_app";

const OverviewGridItemContainer: React.FC<{}> = (props) => (
  <GridItem colSpan={1}>
    <Flex
      bg={useColorModeValue("white", "gray.950")}
      p="4"
      position="relative"
      rounded="lg"
      border="1px"
      borderColor={useColorModeValue("gray.300", "whiteAlpha.300")}
      role="group"
      flexDir="column"
      justifyContent="center"
      alignItems="center"
    >
      {props.children}
    </Flex>
  </GridItem>
);

interface UptimeMostRecentStatusTableRowProps {
  description: {
    monitorId: string;
    name: string;
    url: string;
    region: string;
  };
  lastChecked: string;
  filterString: string;
  status: string;
  response: {
    code: number;
    message?: string;
  };
}

const createUptimeMostRecentStatusTableRows = (
  data: UptimeMonitorWithStatuses[]
): UptimeMostRecentStatusTableRowProps[] => {
  return data.map((monitor) => {
    const mostRecentStatus =
      monitor.statuses && monitor.statuses.length > 0
        ? monitor.statuses?.reduce((prev, current) => {
            return prev.timestamp > current.timestamp ? prev : current;
          })
        : null;
    const now = Date.now();

    return {
      description: {
        monitorId: monitor.monitor_id,
        name: monitor.name,
        url: monitor.url,
        region: regionToLocationStringMap[monitor.region],
      },
      lastChecked: mostRecentStatus
        ? (timeAgo.format(now - (now - mostRecentStatus.timestamp)) as string)
        : "N/A",
      status: monitor.paused
        ? "paused"
        : mostRecentStatus
        ? mostRecentStatus.status
        : "Pending Data",
      filterString: [
        monitor.name,
        monitor.url,
        mostRecentStatus ? mostRecentStatus : "",
        monitor.region,
      ].join(" "),
      response: {
        code: mostRecentStatus?.response.statusCode ?? -1,
        message: mostRecentStatus?.response.statusMessage,
      },
    };
  });
};

const UptimeMostRecentStatusTable = ({
  data,
}: {
  data: UptimeMonitorWithStatuses[] | undefined;
}) => {
  const tableColumns: Column[] = [
    {
      Header: "Monitor",
      accessor: "description",
      Cell: (props) => DescriptionCell(props.cell.value),
    },
    {
      Header: "Last checked",
      accessor: "lastChecked",
    },
    {
      Header: "Status",
      accessor: "status",
      Cell: (props) => StatusCell({ status: props.cell.value }),
    },
    {
      Header: "Response Status Code",
      accessor: "response",
      disableSortBy: true,
      Cell: (props) => ResponseCell({ ...props.cell.value }),
    },
    {
      id: "filter-column",
      filter: "includes",
      accessor: "filterString",
    },
  ];

  const statuses = data;

  return CommonOverviewTable<UptimeMostRecentStatusTableRowProps>({
    data: {
      dependencies: [statuses ?? []],
      dependenciesIsLoading: statuses === undefined,
      rowPropsGeneratorFunction: createUptimeMostRecentStatusTableRows,
    },
    columns: tableColumns,
    itemType: "Uptime Monitor Statuses",
  });
};

const Overview: ExtendedNextPage = () => {
  const router = useRouter();
  const { projectId } = router.query;
  const { projects, projectsIsLoading, projectsFetchError } = useProjects();
  const { team } = useTeam();

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
      if (statuses[id][0].status === "down") {
        totalDownMonitors = totalDownMonitors + 1;
      }
    }
  }

  const { invocations, isLoading: invocationsIsLoading } =
    useAlertInvocationsAllTime(monitors.map((m) => m.monitor_id));

  let totalOngoingAlerts = 0;
  if (invocations) {
    for (let id of Object.keys(invocations)) {
      if (invocations[id].length > 0 && invocations[id][0].ongoing) {
        totalOngoingAlerts = totalOngoingAlerts + 1;
      }
    }
  }

  return (
    <PageLayout isAppPage>
      <AppSubNav
        links={[
          {
            isSelected: true,
            href: "/app/projects/" + projectId,
            text: "Overview",
          },
          {
            isSelected: false,
            href: "/app/projects/" + projectId + "/uptime",
            text: "Uptime Monitors",
          },
          {
            isSelected: false,
            href: "/app/projects/" + projectId + "/settings",
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
          <Grid
            templateColumns={[
              "repeat(1, 1fr)",
              "repeat(2, 1fr)",
              null,
              "repeat(3, 1fr)",
            ]}
            gap={6}
            my="5"
          >
            <OverviewGridItemContainer>
              <Heading fontSize="xl">Total Uptime Monitors:</Heading>
              <Box fontSize="2xl" fontWeight="bold">
                {monitors.length}
              </Box>
            </OverviewGridItemContainer>
            <OverviewGridItemContainer>
              <Heading fontSize="xl">Total Down Uptime Monitors:</Heading>
              <Box fontSize="2xl" fontWeight="bold">
                {totalDownMonitors}
              </Box>
            </OverviewGridItemContainer>
            <OverviewGridItemContainer>
              <Heading fontSize="xl">Total Ongoing Alerts:</Heading>
              <Box fontSize="2xl" fontWeight="bold">
                {totalOngoingAlerts}
              </Box>
            </OverviewGridItemContainer>
          </Grid>

          {statuses && monitors && !statusesIsLoading && !monitorsIsLoading && (
            <UptimeMostRecentStatusTable
              data={createMonitorDataWithStatus(statuses, monitors)}
            />
          )}
        </>
      )}
    </PageLayout>
  );
};

Overview.requiresAuth = true;
export default Overview;
