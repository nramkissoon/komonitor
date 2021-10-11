import React from "react";
import { PageLayout } from "../../../src/common/components/Page-Layout";
import { ExtendedNextPage } from "../../_app";

const App: ExtendedNextPage = () => {
  return <PageLayout isAppPage></PageLayout>;
};

App.requiresAuth = true;
export default App;
