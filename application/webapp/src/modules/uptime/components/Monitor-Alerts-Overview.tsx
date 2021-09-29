import { Alert as ChakraAlert, AlertIcon, Box } from "@chakra-ui/react";
import { Alert, AlertInvocation } from "project-types";
import React from "react";

interface MonitorAlertsOverviewProps {
  alerts: Alert[] | undefined;
  alertInvocations: { [alertId: string]: AlertInvocation[] } | undefined;
}

export function MonitorAlertsOverview(props: MonitorAlertsOverviewProps) {
  const { alerts, alertInvocations } = props;
  return alerts === undefined || alerts.length === 0 ? (
    <Box mt="2em">
      <ChakraAlert status="warning" variant="left-accent">
        <AlertIcon />
        There are no alerts attached to this monitor. You can edit this monitor
        to attach an alert to it.
      </ChakraAlert>
    </Box>
  ) : (
    <></>
  );
}
