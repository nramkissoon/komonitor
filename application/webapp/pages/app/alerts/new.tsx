import { Fade } from "@chakra-ui/react";
import React from "react";
import { LoadingSpinner } from "../../../src/common/components/Loading-Spinner";
import { PageLayout } from "../../../src/common/components/Page-Layout";
import { CreateUpdateFormRewrite } from "../../../src/modules/alerts/components/Create-Update-Form-Rewrite";
import { useUserServicePlanProductId } from "../../../src/modules/user/client";
import { ExtendedNextPage } from "../../_app";

const New: ExtendedNextPage = () => {
  const {
    data,
    isError: userIsError,
    isLoading: userIsLoading,
  } = useUserServicePlanProductId();

  return (
    <PageLayout isAppPage>
      {!userIsLoading ? (
        <Fade in={!userIsLoading}>
          <CreateUpdateFormRewrite productId={data.productId as string} />
        </Fade>
      ) : (
        <Fade in={userIsLoading} delay={0.2}>
          {LoadingSpinner()}
        </Fade>
      )}
    </PageLayout>
  );
};

New.requiresAuth = true;
export default New;
