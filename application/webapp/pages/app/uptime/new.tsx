import { Fade } from "@chakra-ui/react";
import React from "react";
import { LoadingSpinner } from "../../../src/common/components/Loading-Spinner";
import { PageLayout } from "../../../src/common/components/Page-Layout";
import { useAlerts } from "../../../src/modules/alerts/client";
import { CreateUpdateFormRewrite } from "../../../src/modules/uptime/components/Create-Update-Form-Rewrite";
import { useUserServicePlanProductId } from "../../../src/modules/user/client";
import { ExtendedNextPage } from "../../_app";

const New: ExtendedNextPage = () => {
  const {
    data,
    isError: userIsError,
    isLoading: userIsLoading,
  } = useUserServicePlanProductId();
  const {
    alerts,
    isLoading: alertsIsLoading,
    isError: alertsIsError,
  } = useAlerts();

  let isLoading = alertsIsLoading || userIsLoading;

  return (
    <PageLayout isAppPage>
      {!isLoading ? (
        <Fade in={!isLoading}>
          <CreateUpdateFormRewrite
            product_id={data.productId as string}
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

New.requiresAuth = true;
export default New;
