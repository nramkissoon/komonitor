import { Fade, Flex, Heading, Spacer, Text } from "@chakra-ui/react";
import React from "react";
import { AppHeader } from "../../../src/common/components/App-Header";
import { LoadingSpinner } from "../../../src/common/components/Loading-Spinner";
import { PageContainer } from "../../../src/common/components/Page-Container";
import {
  use24HourAlertInvocations,
  useAlerts,
} from "../../../src/modules/alerts/client";
import { CreateButton } from "../../../src/modules/alerts/components/Create-Button";
import { ExtendedNextPage } from "../../_app";

const Alert: ExtendedNextPage = () => {
  const {
    alerts,
    isError: alertsIsError,
    isLoading: alertsIsLoading,
  } = useAlerts();
  const {
    invocations,
    isError: invocationsIsError,
    isLoading: invocationsIsLoading,
  } = use24HourAlertInvocations(
    alerts ? alerts.map((alert) => alert.alert_id) : []
  );

  return (
    <>
      <Fade in={true}>
        <AppHeader />
      </Fade>
      <PageContainer>
        <Fade in={true}>
          <Flex mb="1.8em">
            <Heading size="lg" fontWeight="normal">
              Alerts{" "}
              <Text fontSize="sm" color="gray.500">
                (Last 24 hours)
              </Text>
            </Heading>
            <Spacer />
            <CreateButton />
          </Flex>
        </Fade>

        {alertsIsLoading ? (
          <Fade in={alertsIsLoading} delay={0.2}>
            {LoadingSpinner()}
          </Fade>
        ) : (
          <Fade in={!alertsIsLoading}>
            <></>
          </Fade>
        )}
      </PageContainer>
    </>
  );
};

Alert.requiresAuth = true;
export default Alert;
