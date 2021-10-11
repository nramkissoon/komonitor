import { Fade, Flex, Heading, Spacer } from "@chakra-ui/react";
import React from "react";
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
        <Flex mb="1.8em">
          <Heading size="lg" fontWeight="normal" m="auto">
            Alerts
          </Heading>
          <Spacer />
          <CreateButton />
        </Flex>
      </Fade>
      <OverviewTable alerts={alerts} isLoading={alertsIsLoading} />
    </PageLayout>
  );
};

Alert.requiresAuth = true;
export default Alert;
