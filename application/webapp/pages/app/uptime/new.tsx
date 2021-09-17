import React from "react";
import { AppHeader } from "../../../src/common/components/App-Header";
import { CreateUpdateForm } from "../../../src/modules/uptime/components/Create-Update-Form";
import { useUserServicePlanProductId } from "../../../src/modules/user/client";
import { ExtendedNextPage } from "../../_app";

const New: ExtendedNextPage = () => {
  const { data, isError, isLoading } = useUserServicePlanProductId();

  return (
    <>
      <AppHeader />
      {!isError && !isLoading ? (
        <CreateUpdateForm product_id={data.productId as string} />
      ) : (
        <>ERROR OR LOADING</>
      )}
    </>
  );
};

New.requiresAuth = true;
export default New;
