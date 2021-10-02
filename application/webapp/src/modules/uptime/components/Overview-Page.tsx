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
import { Alert, AlertInvocation, UptimeMonitor } from "project-types";
import React from "react";
import {
  DeleteDialog,
  useDeleteDialog,
} from "../../../common/components/Delete-Dialog";
import { use24HourAlertInvocations, useAlerts } from "../../alerts/client";
import { deleteMonitor, use24HourMonitorStatuses } from "../client";
import { MonitorAlertsOverview } from "./Monitor-Alerts-Overview";
import { OverviewPageDataCards } from "./Overview-Page-Data-Cards";
import { OverviewPageGraph } from "./Overview-Page-Graph";
import { OverviewPageHeader } from "./Overview-Page-Header";
import { StatusTable } from "./Status-Table";

interface OverviewPageProps {
  monitor: UptimeMonitor;
}

export function OverviewPage(props: OverviewPageProps) {
  const { monitor } = props;
  const { name, url, monitor_id, region, alert_id } = monitor;
  const {
    statuses,
    isError: statusesIsError,
    isLoading: statusesIsLoading,
  } = use24HourMonitorStatuses([monitor_id as string]);
  const {
    alerts,
    isError: alertsIsError,
    isLoading: alertsIsLoading,
  } = useAlerts();

  const mostRecentStatus = React.useMemo(() => {
    return statuses && statuses[monitor_id].length > 0
      ? statuses[monitor_id]?.reduce((prev, current) => {
          return prev.timestamp > current.timestamp ? prev : current;
        })
      : null;
  }, [statuses]);

  // this will be a list because monitors will eventually have multiple alerts
  const alertsForMonitor: Alert[] = React.useMemo(() => {
    return alerts ? alerts.filter((alert) => alert_id === alert.alert_id) : [];
  }, [alert_id, alerts]);

  // get the invocations for the relevant alerts
  const {
    invocations,
    isError: invocationsIsError,
    isLoading: invocationsIsLoading,
  } = use24HourAlertInvocations(
    alertsForMonitor.map((alert) => alert.alert_id)
  );

  // filter out the invocations not related to this specific monitor
  let invocationsForMonitor: { [alertId: string]: AlertInvocation[] } = {};
  for (let id of Object.keys(invocations ?? {})) {
    let filteredInvocations: AlertInvocation[] = invocations[id].filter(
      (invocation) => invocation.monitor_id === monitor_id
    );
    invocationsForMonitor[id] = filteredInvocations;
  }

  // Setup for delete dialog
  let {
    mutate,
    deleteItem,
    setDeleteItem,
    onCloseDeleteDialog,
    openDeleteDialog,
    cancelRef,
  } = useDeleteDialog();

  return (
    <Box>
      {DeleteDialog({
        isOpen: deleteItem.id !== undefined,
        itemName: deleteItem.name,
        itemId: deleteItem.id,
        onClose: onCloseDeleteDialog,
        leastDestructiveRef: cancelRef,
        mutate: mutate,
        mutateApiUrl: "/api/uptime/monitors",
        deleteApiFunc: deleteMonitor,
        itemType: "monitor",
        onSuccess: () => router.push("/app/uptime"),
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
          <TabPanel p="0">
            <MonitorAlertsOverview
              alerts={alertsForMonitor}
              alertInvocations={invocationsForMonitor}
            />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Box>
  );
}
//8======D
