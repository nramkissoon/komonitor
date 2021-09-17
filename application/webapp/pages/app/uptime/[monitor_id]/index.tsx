import { useRouter } from "next/router";
import React from "react";
import { AppHeader } from "../../../../src/common/components/App-Header";
import { useUptimeMonitors } from "../../../../src/modules/uptime/client";
import { ExtendedNextPage } from "../../../_app";

const Uptime: ExtendedNextPage = () => {
  const { monitors, isLoading, isError } = useUptimeMonitors();
  const router = useRouter();
  const { monitor_id } = router.query;
  console.log(monitor_id);
  return (
    <>
      <AppHeader />
    </>
  );
};

Uptime.requiresAuth = true;
export default Uptime;
