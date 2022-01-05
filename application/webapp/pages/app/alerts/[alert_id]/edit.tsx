import { Fade } from "@chakra-ui/transition";
import { useRouter } from "next/router";
import { Alert } from "project-types";
import React from "react";
import { LoadingSpinner } from "../../../../src/common/components/Loading-Spinner";
import { PageLayout } from "../../../../src/common/components/Page-Layout";
import { useAlerts } from "../../../../src/modules/alerts/client";
import { CreateUpdateFormRewrite } from "../../../../src/modules/alerts/components/Create-Update-Form-Rewrite";
import { useUserServicePlanProductId } from "../../../../src/modules/user/client";
import { ExtendedNextPage } from "../../../_app";

const AlertEdit: ExtendedNextPage = () => {
  const {
    data,
    isError: productIdIsError,
    isLoading: productIdIsLoading,
  } = useUserServicePlanProductId();
  const {
    alerts,
    isLoading: alertsIsLoading,
    isError: alertsIsError,
  } = useAlerts();

  const isLoading = productIdIsLoading || alertsIsLoading;
  const isError = alertsIsError || productIdIsError;

  const router = useRouter();
  const { alert_id } = router.query;
  let alert: Alert | undefined;
  for (let a of alerts ?? []) {
    if (a.alert_id === alert_id) alert = a;
  }
  return (
    <PageLayout isAppPage>
      {!isError && !isLoading && alert ? (
        <Fade in={!isLoading}>
          <CreateUpdateFormRewrite
            productId={data.productId as string}
            currentAlertAttributes={alert}
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

AlertEdit.requiresAuth = true;
export default AlertEdit;
