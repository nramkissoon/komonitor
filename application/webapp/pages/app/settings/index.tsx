import { chakra, Heading } from "@chakra-ui/react";
import { useRouter } from "next/router";
import React from "react";
import { AppSubNav } from "../../../src/common/components/App-Sub-Nav";
import { PageLayout } from "../../../src/common/components/Page-Layout";
import { SettingsTabs } from "../../../src/modules/settings/components/SettingsTabs";
import { ExtendedNextPage } from "../../_app";

const App: ExtendedNextPage = () => {
  const router = useRouter();
  const { tab } = router.query;
  return (
    <PageLayout isAppPage maxW={["sm", "xl", "3xl", "5xl", "6xl"]}>
      <AppSubNav
        links={[
          { isSelected: false, href: "/app", text: "Projects" },
          { isSelected: true, href: "/app/settings", text: "Settings" },
        ]}
      />
      <Heading textAlign="left" fontWeight="medium" mb=".2em" fontSize="3xl">
        Settings and Personal Account Information
      </Heading>
      <chakra.hr mb="1em"></chakra.hr>
      <SettingsTabs initialTab={Number.parseInt(tab as string)} />
    </PageLayout>
  );
};

App.requiresAuth = true;
export default App;
