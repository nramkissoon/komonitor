import { useRouter } from "next/router";
import React from "react";
import { UptimeMonitor } from "types";
import { AppHeader } from "../../../../src/common/components/App-Header";
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

  const isLoading = monitorsIsLoading || productIdIsLoading;
  const isError = monitorsIsError || productIdIsError;

  const router = useRouter();
  const { monitor_id } = router.query;
  let monitor: UptimeMonitor | undefined;
  for (let m of monitors ?? []) {
    if (m.monitor_id === monitor_id) monitor = m;
  }

  return (
    <>
      <AppHeader />
      {!isError && !isLoading ? (
        <CreateUpdateForm
          product_id={data.productId as string}
          currentMonitorAttributes={monitor}
        />
      ) : (
        <>LOADING OR ERROR</>
      )}
    </>
  );
};

UptimeEdit.requiresAuth = true;
export default UptimeEdit;
