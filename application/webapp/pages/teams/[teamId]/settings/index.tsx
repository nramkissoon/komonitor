import { chakra, Heading } from "@chakra-ui/react";
import { useRouter } from "next/router";
import { useAppBaseRoute } from "../../../../src/common/client-utils";
import { AppSubNav } from "../../../../src/common/components/App-Sub-Nav";
import { PageLayout } from "../../../../src/common/components/Page-Layout";
import { TeamSettingsTabs } from "../../../../src/modules/settings/components/TeamSettingsTabs";
import { ExtendedNextPage } from "../../../_app";

const App: ExtendedNextPage = () => {
  const router = useRouter();
  const { tab } = router.query;
  const baseRoute = useAppBaseRoute();
  return (
    <PageLayout isAppPage maxW={["sm", "xl", "3xl", "5xl", "6xl"]}>
      <AppSubNav
        links={[
          { isSelected: false, href: baseRoute, text: "Projects" },
          {
            isSelected: false,
            href: baseRoute + "/integrations",
            text: "Integrations",
          },
          { isSelected: true, href: baseRoute + "/settings", text: "Settings" },
        ]}
      />
      <Heading textAlign="left" fontWeight="medium" mb=".2em" fontSize="3xl">
        Settings and Team Account Information
      </Heading>
      <chakra.hr mb="1em"></chakra.hr>
      <TeamSettingsTabs initialTab={Number.parseInt(tab as string)} />
    </PageLayout>
  );
};

App.requiresAuth = true;
export default App;
