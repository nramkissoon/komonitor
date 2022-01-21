import React from "react";
import { PageLayout } from "../../../src/common/components/Page-Layout";
import { ExtendedNextPage } from "../../_app";

const Overview: ExtendedNextPage = () => {
  return <PageLayout isAppPage></PageLayout>;
};

Overview.requiresAuth = true;
export default Overview;
