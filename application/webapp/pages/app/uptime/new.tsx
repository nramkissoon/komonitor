import React from "react";
import { AppHeader } from "../../../src/common/components/App-Header";
import { CreateUpdateForm } from "../../../src/modules/uptime/components/Create-Update-Form";
import { ExtendedNextPage } from "../../_app";

const New: ExtendedNextPage = () => {
  return (
    <>
      <AppHeader />
      <CreateUpdateForm product_id="FREE" />
    </>
  );
};

New.requiresAuth = true;
export default New;
