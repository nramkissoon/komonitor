import {
  Box,
  Divider,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
} from "@chakra-ui/react";
import router from "next/router";
import { UptimeMonitor } from "project-types";
import React from "react";
import { useSWRConfig } from "swr";
import { use24HourMonitorStatuses } from "../client";
import { MonitorDeleteDialog } from "./Delete-Monitor-Dialog";
import { OverviewPageDataCards } from "./Overview-Page-Data-Cards";
import { OverviewPageGraph } from "./Overview-Page-Graph";
import { OverviewPageHeader } from "./Overview-Page-Header";
import { StatusTable } from "./Status-Table";

interface OverviewPageProps {
  monitor: UptimeMonitor;
}

export function OverviewPage(props: OverviewPageProps) {
  const { monitor } = props;
  const { name, url, monitor_id, region } = monitor;
  const {
    statuses,
    isError: statusesIsError,
    isLoading: statusesIsLoading,
  } = use24HourMonitorStatuses([monitor_id as string]);

  const mostRecentStatus = React.useMemo(() => {
    return statuses && statuses[monitor_id].length > 0
      ? statuses[monitor_id]?.reduce((prev, current) => {
          return prev.timestamp > current.timestamp ? prev : current;
        })
      : null;
  }, [statuses]);

  // Setup for delete dialog
  let { mutate } = useSWRConfig();
  let [deleteMonitor, setDeleteMonitor] = React.useState({} as any);
  const onCloseDeleteDialog = () => {
    setDeleteMonitor({});
    router.push("/app/uptime/?monitorDeleted=true");
  };
  const cancelRef = React.useRef(true);
  const openDeleteDialog = (name: string, id: string) =>
    setDeleteMonitor({ name: name, monitorId: id });

  return (
    <Box mt=".5em">
      {MonitorDeleteDialog({
        isOpen: deleteMonitor.monitorId !== undefined,
        name: deleteMonitor.name as string,
        monitorId: deleteMonitor.monitorId as string,
        onClose: onCloseDeleteDialog,
        leastDestructiveRef: cancelRef,
        mutate: mutate,
      })}
      <OverviewPageHeader
        monitorName={name}
        monitorUrl={url}
        currentStatus={mostRecentStatus?.status as string}
        lastChecked={mostRecentStatus?.timestamp}
        monitorId={monitor_id}
        monitorRegion={region}
        openDeleteDialog={openDeleteDialog}
      />
      <Divider mb="1em" />
      <Tabs>
        <TabList mb="1em">
          <Tab>Overview</Tab>
          <Tab>Statuses</Tab>
          <Tab>Alerts</Tab>
        </TabList>
        <TabPanels>
          <TabPanel p="0">
            <OverviewPageDataCards
              monitorId={monitor_id}
              statuses={statuses ? statuses[monitor_id] : undefined}
            />
            <OverviewPageGraph
              monitorId={monitor_id}
              statuses={statuses ? statuses[monitor_id] : undefined}
            />
          </TabPanel>
          <TabPanel p="0">
            <StatusTable
              monitorId={monitor_id}
              statuses={statuses ? statuses[monitor_id] : undefined}
            />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Box>
  );
}
//8======D
