import { Fade, Flex, Heading, Spacer, Text } from "@chakra-ui/react";
import React from "react";
import { AppHeader } from "../../../src/common/components/App-Header";
import { PageContainer } from "../../../src/common/components/Page-Container";
import { useAlerts } from "../../../src/modules/alerts/client";
import { CreateButton } from "../../../src/modules/alerts/components/Create-Button";
import { OverviewTable } from "../../../src/modules/alerts/components/Overview-Table";
import { ExtendedNextPage } from "../../_app";

const Alert: ExtendedNextPage = () => {
  const {
    alerts,
    isError: alertsIsError,
    isLoading: alertsIsLoading,
  } = useAlerts();

  return (
    <>
      <Fade in={true}>
        <AppHeader />
      </Fade>
      <PageContainer mt=".5em">
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
        <OverviewTable alerts={alerts} isLoading={alertsIsLoading} />
      </PageContainer>
    </>
  );
};

Alert.requiresAuth = true;
export default Alert;
