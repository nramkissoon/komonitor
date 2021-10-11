import { Fade } from "@chakra-ui/react";
import { useRouter } from "next/router";
import { UptimeMonitor } from "project-types";
import React from "react";
import { LoadingSpinner } from "../../../../src/common/components/Loading-Spinner";
import { PageLayout } from "../../../../src/common/components/Page-Layout";
import { useAlerts } from "../../../../src/modules/alerts/client";
import { useUptimeMonitors } from "../../../../src/modules/uptime/client";
import { CreateUpdateForm } from "../../../../src/modules/uptime/components/Create-Update-Form";
import { useUserServicePlanProductId } from "../../../../src/modules/user/client";
import { ExtendedNextPage } from "../../../_app";

const UptimeEdit: ExtendedNextPage = () => {
  const {
    monitors,
    isLoading: monitorsIsLoading,
    isError: monitorsIsError,
  } = useUptimeMonitors();
  const {
    data,
    isError: productIdIsError,
    isLoading: productIdIsLoading,
  } = useUserServicePlanProductId();
  const {
    alerts,
    isLoading: alertsIsLoading,
    isError: alertsIsError,
  } = useAlerts();

  const isLoading = monitorsIsLoading || productIdIsLoading || alertsIsLoading;
  const isError = monitorsIsError || productIdIsError;

  const router = useRouter();
  const { monitor_id } = router.query;
  let monitor: UptimeMonitor | undefined;
  for (let m of monitors ?? []) {
    if (m.monitor_id === monitor_id) monitor = m;
  }

  return (
    <PageLayout isAppPage>
      {!isError && !isLoading && monitor ? (
        <Fade in={!isLoading}>
          <CreateUpdateForm
            product_id={data.productId as string}
            currentMonitorAttributes={monitor}
            userAlerts={alerts}
          />
        </Fade>
      ) : (
        <Fade in={isLoading} delay={0.2}>
          {LoadingSpinner()}
        </Fade>
      )}
    </PageLayout>
  );
};

UptimeEdit.requiresAuth = true;
export default UptimeEdit;
