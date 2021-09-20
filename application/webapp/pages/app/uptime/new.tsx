import { Fade } from "@chakra-ui/react";
import React from "react";
import { AppHeader } from "../../../src/common/components/App-Header";
import { LoadingSpinner } from "../../../src/common/components/Loading-Spinner";
import { PageContainer } from "../../../src/common/components/Page-Container";
import { CreateUpdateForm } from "../../../src/modules/uptime/components/Create-Update-Form";
import { useUserServicePlanProductId } from "../../../src/modules/user/client";
import { ExtendedNextPage } from "../../_app";

const New: ExtendedNextPage = () => {
  const { data, isError, isLoading } = useUserServicePlanProductId();

  return (
    <>
      <Fade in={true}>
        <AppHeader />
      </Fade>
      <PageContainer>
        {!isLoading ? (
          <Fade in={!isLoading}>
            <CreateUpdateForm product_id={data.productId as string} />
          </Fade>
        ) : (
          <Fade in={isLoading} delay={0.2}>
            {LoadingSpinner()}
          </Fade>
        )}
      </PageContainer>
    </>
  );
};

New.requiresAuth = true;
export default New;
