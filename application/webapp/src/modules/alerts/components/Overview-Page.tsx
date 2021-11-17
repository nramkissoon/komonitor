import {
  Box,
  Divider,
  Heading,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  useToast,
} from "@chakra-ui/react";
import router from "next/router";
import { Alert, UptimeMonitor } from "project-types";
import React from "react";
import {
  DeleteDialog,
  useDeleteDialog,
} from "../../../common/components/Delete-Dialog";
import { useUptimeMonitors } from "../../uptime/client";
import {
  alertApiUrl,
  deleteAlert,
  useAlertInvocationsAllTime,
} from "../client";
import { AttachedMonitorsTable } from "./Attached-Monitors-Table";
import { InvocationTable } from "./Invocation-Table";
import { OverviewPageBottomLayout } from "./Overview-Page-Bottom-Layout";
import { OverviewPageDataCards } from "./Overview-Page-Data-Cards";
import { OverviewPageHeader } from "./Overview-Page-Header";

interface OverviewPageProps {
  alert: Alert;
}

export function OverviewPage(props: OverviewPageProps) {
  const { alert } = props;
  const {
    name,
    alert_id,
    state,
    severity,
    description,
    recipients,
    type,
    created_at,
  } = alert;

  const {
    monitors: uptimeMonitors,
    isError: monitorsIsError,
    isLoading: monitorsIsLoading,
  } = useUptimeMonitors();

  // TODO use lighthouse monitors
  // TODO use browser monitors

  const {
    invocations,
    isError: invocationsIsError,
    isLoading: invocationsIsLoading,
  } = useAlertInvocationsAllTime([alert_id]);

  // Setup for delete dialog
  let {
    mutate,
    deleteItem,
    setDeleteItem,
    onCloseDeleteDialog,
    openDeleteDialog,
    cancelRef,
  } = useDeleteDialog();

  const errorToast = useToast();
  const postErrorToast = (message: string) =>
    errorToast({
      title: "Unable to delete alert.",
      description: message,
      status: "error",
      duration: 9000,
      isClosable: true,
      variant: "solid",
      position: "top",
    });

  let attachedUptimeMonitors: UptimeMonitor[] = [];
  // TODO check for multiple alerts when applicable
  attachedUptimeMonitors = uptimeMonitors
    ? uptimeMonitors.filter((monitor) => alert_id === monitor.alert_id)
    : [];

  // TODO attached lighthouse
  // TODO attached browser
  //TODO combine attached

  let mostRecentInvocation: number | undefined = undefined;
  mostRecentInvocation = invocations
    ? invocations[alert_id].length === 0
      ? -1
      : invocations[alert_id]
          .sort((a, b) => a.timestamp - b.timestamp)
          .reverse()[0].timestamp
    : undefined;

  return (
    <Box>
      {DeleteDialog({
        isOpen: deleteItem.id !== undefined,
        itemName: deleteItem.name as string,
        itemId: deleteItem.id as string,
        onClose: onCloseDeleteDialog,
        leastDestructiveRef: cancelRef,
        mutate: mutate,
        mutateApiUrl: alertApiUrl,
        deleteApiFunc: deleteAlert,
        itemType: "alert",
        onError: postErrorToast,
        onSuccess: () => router.push("/app/alerts"),
      })}
      <OverviewPageHeader
        name={name}
        createdAt={created_at}
        id={alert_id}
        type={type}
        openDeleteDialog={openDeleteDialog}
      />
      <Divider mb="1em" />
      <Tabs>
        <TabList mb="1em">
          <Tab>Overview</Tab>
          <Tab>Invocations</Tab>
        </TabList>
        <TabPanels>
          <TabPanel p="0">
            <OverviewPageDataCards
              state={state}
              severity={severity}
              mostRecentInvocationTimestamp={mostRecentInvocation}
            />
            <OverviewPageBottomLayout
              description={description}
              recipients={recipients}
            />
            <AttachedMonitorsTable
              alertId={alert_id}
              attachedMonitors={attachedUptimeMonitors}
              isLoading={monitorsIsLoading}
            />
          </TabPanel>
          <TabPanel p="0">
            {!invocationsIsError && !invocationsIsLoading && invocations ? (
              invocations[alert_id].length === 0 ? (
                <Heading textAlign="center" mt="1em">
                  No Invocations for this Alert
                </Heading>
              ) : (
                <InvocationTable invocations={invocations[alert_id]} />
              )
            ) : (
              "Error"
            )}
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Box>
  );
}
