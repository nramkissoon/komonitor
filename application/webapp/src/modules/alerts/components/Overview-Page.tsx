import { Box, Divider, useToast } from "@chakra-ui/react";
import router from "next/router";
import { Alert, UptimeMonitor } from "project-types";
import React from "react";
import {
  DeleteDialog,
  useDeleteDialog,
} from "../../../common/components/Delete-Dialog";
import { useUptimeMonitors } from "../../uptime/client";
import { alertApiUrl, deleteAlert, use24HourAlertInvocations } from "../client";
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
    monitors,
    isError: monitorsIsError,
    isLoading: monitorsIsLoading,
  } = useUptimeMonitors();

  const {
    invocations,
    isError: invocationsIsError,
    isLoading: invocationsIsLoading,
  } = use24HourAlertInvocations([alert_id]);

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

  let attachedMonitors: UptimeMonitor[] = [];
  // TODO check for multiple alerts when applicable
  attachedMonitors = monitors
    ? monitors.filter((monitor) => alert_id === monitor.alert_id)
    : [];

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
    </Box>
  );
}
