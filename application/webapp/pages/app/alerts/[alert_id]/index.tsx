import { Fade } from "@chakra-ui/react";
import { useRouter } from "next/router";
import { Alert } from "project-types";
import React from "react";
import { AppHeader } from "../../../../src/common/components/App-Header";
import { LoadingSpinner } from "../../../../src/common/components/Loading-Spinner";
import { PageContainer } from "../../../../src/common/components/Page-Container";
import { useAlerts } from "../../../../src/modules/alerts/client";
import { OverviewPage } from "../../../../src/modules/alerts/components/Overview-Page";
import { ExtendedNextPage } from "../../../_app";

const Overview: ExtendedNextPage = () => {
  const { alerts, isError, isLoading } = useAlerts();

  const router = useRouter();
  const { alert_id } = router.query;

  let alert: Alert | undefined;
  for (let a of alerts ?? []) {
    if (a.alert_id === alert_id) alert = a;
  }

  return (
    <>
      <Fade in={true}>
        <AppHeader />
      </Fade>
      <PageContainer>
        {!isLoading && alert ? (
          <Fade in={!isLoading}>
            <OverviewPage alert={alert} />
          </Fade>
        ) : (
          <Fade in={isLoading} delay={0.2}>
            {LoadingSpinner()}
          </Fade>
        )}
      </PageContainer>
    </>
  );
};

Overview.requiresAuth = true;
export default Overview;
