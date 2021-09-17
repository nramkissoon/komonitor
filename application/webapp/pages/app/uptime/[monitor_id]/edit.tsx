import { useRouter } from "next/router";
import React from "react";
import { UptimeMonitor } from "types";
import { AppHeader } from "../../../../src/common/components/App-Header";
import { useUptimeMonitors } from "../../../../src/modules/uptime/client";
import { CreateUpdateForm } from "../../../../src/modules/uptime/components/Create-Update-Form";
import { ExtendedNextPage } from "../../../_app";

const UptimeEdit: ExtendedNextPage = () => {
  const { monitors, isLoading, isError } = useUptimeMonitors();
  const router = useRouter();
  const { monitor_id } = router.query;
  let monitor: UptimeMonitor | undefined;
  for (let m of monitors ?? []) {
    if (m.monitor_id === monitor_id) monitor = m;
  }

  return (
    <>
      <AppHeader />
      <CreateUpdateForm
        product_id="FREE"
        currentMonitorAttributes={isLoading || isError ? undefined : monitor}
      />
    </>
  );
};

UptimeEdit.requiresAuth = true;
export default UptimeEdit;
