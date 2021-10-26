import React from "react";
import { ComingSoonPage } from "../../../src/common/components/Coming-Soon-Page";
import { ExtendedNextPage } from "../../_app";

const App: ExtendedNextPage = () => {
  return (
    <ComingSoonPage
      feature={"Lighthouse Monitors"}
      isAppPage={true}
    ></ComingSoonPage>
  );
};

App.requiresAuth = true;
export default App;
