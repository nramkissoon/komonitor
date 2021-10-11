import { Fade } from "@chakra-ui/react";
import { useRouter } from "next/router";
import { UptimeMonitor } from "project-types";
import React from "react";
import { LoadingSpinner } from "../../../../src/common/components/Loading-Spinner";
import { PageLayout } from "../../../../src/common/components/Page-Layout";
import { useUptimeMonitors } from "../../../../src/modules/uptime/client";
import { OverviewPage } from "../../../../src/modules/uptime/components/Overview-Page";
import { ExtendedNextPage } from "../../../_app";

const Overview: ExtendedNextPage = () => {
  const {
    monitors,
    isLoading: monitorsIsLoading,
    isError: monitorsIsError,
  } = useUptimeMonitors(); // use monitors at the root page because this is the minimum data we need to render children components

  const router = useRouter();
  const { monitor_id } = router.query;

  let monitor: UptimeMonitor | undefined;
  for (let m of monitors ?? []) {
    if (m.monitor_id === monitor_id) monitor = m;
  }
  return (
    <PageLayout isAppPage>
      {!monitorsIsLoading && monitor ? (
        <Fade in={!monitorsIsLoading}>
          <OverviewPage monitor={monitor} />
        </Fade>
      ) : (
        <Fade in={monitorsIsLoading} delay={0.2}>
          {LoadingSpinner()}
        </Fade>
      )}
    </PageLayout>
  );
};

Overview.requiresAuth = true;
export default Overview;
