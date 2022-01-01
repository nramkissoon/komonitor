import { chakra, Fade, Flex, Heading, Spacer } from "@chakra-ui/react";
import React from "react";
import { BackToDashboardButton } from "../../../src/common/components/Back-To-Dashboard-Link";
import { PageLayout } from "../../../src/common/components/Page-Layout";
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
    <PageLayout isAppPage>
      <Fade in={true}>
        <BackToDashboardButton />
        <Flex mb="1.3em" mt="5px">
          <Heading size="lg" fontWeight="normal" m="auto">
            My Alerts
          </Heading>
          <Spacer />
          <CreateButton />
        </Flex>
        <chakra.hr mb="1em"></chakra.hr>
      </Fade>
      <OverviewTable alerts={alerts} isLoading={alertsIsLoading} />
    </PageLayout>
  );
};

Alert.requiresAuth = true;
export default Alert;
