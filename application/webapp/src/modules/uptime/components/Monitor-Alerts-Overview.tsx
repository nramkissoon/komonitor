import { InfoOutlineIcon } from "@chakra-ui/icons";
import {
  Alert as ChakraAlert,
  AlertIcon,
  Box,
  Button,
  Flex,
  Heading,
  Spacer,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  useColorModeValue,
} from "@chakra-ui/react";
import router from "next/router";
import { Alert, AlertInvocation } from "project-types";
import React from "react";
import { InvocationTable } from "./Invocation-Table";

interface MonitorAlertsOverviewProps {
  alerts: Alert[] | undefined;
  alertInvocations: { [alertId: string]: AlertInvocation[] } | undefined;
  tzOffset: number;
}

export function MonitorAlertsOverview(props: MonitorAlertsOverviewProps) {
  const { alerts, alertInvocations, tzOffset } = props;

  return alerts === undefined || alerts.length === 0 ? (
    <Box mt="2em">
      <ChakraAlert status="warning" variant="left-accent">
        <AlertIcon />
        There are no alerts attached to this monitor. You can edit this monitor
        to attach an alert to it.
      </ChakraAlert>
    </Box>
  ) : (
    <Box
      bg={useColorModeValue("white", "#0f131a")}
      borderRadius="xl"
      p="1.5em"
      mb="3em"
      shadow="lg"
    >
      <Tabs orientation="vertical" size="lg">
        <TabList>
          {alerts.map((alert) => (
            <Tab key={alert.alert_id}>{alert.name}</Tab>
          ))}
        </TabList>
        <TabPanels>
          {alerts.map((alert) => {
            const ViewAlertButton = (
              <Button
                leftIcon={<InfoOutlineIcon />}
                colorScheme="blue"
                color="white"
                bgColor="blue.500"
                shadow="sm"
                _hover={{
                  bg: "blue.600",
                }}
                fontWeight="normal"
                onClick={() => router.push("/app/alerts/" + alert.alert_id)}
              >
                View Alert
              </Button>
            );

            if (
              alertInvocations !== undefined &&
              (alertInvocations[alert.alert_id] === undefined ||
                alertInvocations[alert.alert_id].length === 0)
            ) {
              return (
                <TabPanel key={"table" + alert.alert_id} py="0" px="1.5em">
                  <Flex mt=".5em" wrap="wrap" justifyContent="space-between">
                    <Heading fontWeight="medium" size="lg">
                      No Invocations for this Alert
                    </Heading>
                    {ViewAlertButton}
                  </Flex>
                </TabPanel>
              );
            }

            return (
              <TabPanel key={"table" + alert.alert_id} py="0" px="1.5em">
                <Flex mb="1em">
                  <Heading fontWeight="medium" size="lg">
                    Alert Invocations
                  </Heading>
                  <Spacer />
                  {ViewAlertButton}
                </Flex>
                <InvocationTable
                  invocations={
                    alertInvocations === undefined
                      ? alertInvocations
                      : alertInvocations[alert.alert_id] ?? []
                  }
                  tzOffset={tzOffset}
                />
              </TabPanel>
            );
          })}
        </TabPanels>
      </Tabs>
    </Box>
  );
}
