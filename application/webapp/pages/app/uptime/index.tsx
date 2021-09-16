import React from "react";
import { AppHeader } from "../../../src/common/components/App-Header";
import { useUptimeMonitors } from "../../../src/modules/uptime/client";
import { OverviewTable } from "../../../src/modules/uptime/components/Overview-Table";
import { ExtendedNextPage } from "../../_app";

const Uptime: ExtendedNextPage = () => {
  const { monitors, isLoading, isError } = useUptimeMonitors();
  return (
    <>
      <AppHeader />
      {isLoading ? <></> : <OverviewTable data={monitors} />}
    </>
  );
};

Uptime.requiresAuth = true;
export default Uptime;
