import { Heading } from "@chakra-ui/react";
import { useRouter } from "next/router";
import React from "react";
import { AppHeader } from "../../../src/common/components/App-Header";
import { PageContainer } from "../../../src/common/components/Page-Container";
import { SettingsTabs } from "../../../src/modules/settings/components/SettingsTabs";
import { ExtendedNextPage } from "../../_app";

const App: ExtendedNextPage = () => {
  const router = useRouter();
  const { tab } = router.query;
  return (
    <>
      <AppHeader />
      <PageContainer>
        <Heading textAlign="center" fontWeight="normal" mb="1em">
          Settings
        </Heading>
        <SettingsTabs initialTab={tab as string} />
      </PageContainer>
    </>
  );
};

App.requiresAuth = true;
export default App;
