import { Heading } from "@chakra-ui/react";
import { useRouter } from "next/router";
import React from "react";
import { PageLayout } from "../../../src/common/components/Page-Layout";
import { SettingsTabs } from "../../../src/modules/settings/components/SettingsTabs";
import { ExtendedNextPage } from "../../_app";

const App: ExtendedNextPage = () => {
  const router = useRouter();
  const { tab } = router.query;
  return (
    <PageLayout isAppPage>
      <Heading textAlign="center" fontWeight="normal" mb="1em">
        Settings
      </Heading>
      <SettingsTabs initialTab={tab as string} />
    </PageLayout>
  );
};

App.requiresAuth = true;
export default App;
