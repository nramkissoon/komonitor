import { Fade } from "@chakra-ui/react";
import { useRouter } from "next/router";
import { UptimeMonitor } from "project-types";
import React from "react";
import { LoadingSpinner } from "../../../../../../src/common/components/Loading-Spinner";
import { PageLayout } from "../../../../../../src/common/components/Page-Layout";
import { useUptimeMonitorsForProject } from "../../../../../../src/modules/uptime/client";
import { OverviewPage } from "../../../../../../src/modules/uptime/components/Overview-Page";
import { ExtendedNextPage } from "../../../../../_app";

const Overview: ExtendedNextPage = () => {
  const router = useRouter();
  const { monitorId, projectId } = router.query;
  let {
    monitors,
    isLoading: monitorsIsLoading,
    isError: monitorsIsError,
    mutate,
  } = useUptimeMonitorsForProject(projectId as string); // use monitors at the root page because this is the minimum data we need to render children components

  let projectMonitors = monitors ? monitors[projectId as string] : [];

  let monitor: UptimeMonitor | undefined;
  monitor = React.useMemo(() => {
    for (let m of projectMonitors ?? []) {
      if (m.monitor_id === monitorId) return m;
    }
  }, [projectMonitors]);
  return (
    <PageLayout isAppPage>
      {!monitorsIsLoading && monitor ? (
        <Fade in={!monitorsIsLoading}>
          <OverviewPage monitor={monitor} mutate={mutate} />
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
