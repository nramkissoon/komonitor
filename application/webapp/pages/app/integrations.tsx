import {
  Heading,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  useColorModeValue,
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import React from "react";
import { AppSubNav } from "../../src/common/components/App-Sub-Nav";
import { PageLayout } from "../../src/common/components/Page-Layout";
import { ActiveIntegrationList } from "../../src/modules/integrations/components/ActiveIntegrationList";
import { ExtendedNextPage } from "../_app";

const App: ExtendedNextPage = () => {
  const router = useRouter();
  const { tab } = router.query;
  return (
    <PageLayout isAppPage maxW={["sm", "xl", "3xl", "5xl", "6xl"]}>
      <AppSubNav
        links={[
          { isSelected: false, href: "/app", text: "Projects" },
          {
            isSelected: true,
            href: "/app/integrations",
            text: "Integrations",
          },
          { isSelected: false, href: "/app/settings", text: "Settings" },
        ]}
      />
      <Heading textAlign="left" fontWeight="medium" mb=".2em" fontSize="3xl">
        Integrations
      </Heading>
      <Heading
        textAlign="left"
        fontWeight="normal"
        mb="1em"
        fontSize="xl"
        color="gray.500"
      >
        These integrations are available in any project in your personal
        account.
      </Heading>
      <Tabs variant="line">
        <TabList>
          <Tab
            borderBottom="1px"
            _hover={{ bg: useColorModeValue("gray.200", "gray.700") }}
          >
            Active integrations
          </Tab>
          <Tab
            borderBottom="1px"
            _hover={{ bg: useColorModeValue("gray.200", "gray.700") }}
          >
            Add a new integration
          </Tab>
        </TabList>
        <TabPanels p={0}>
          <TabPanel>
            <ActiveIntegrationList />
          </TabPanel>
          <TabPanel>
            <p>two!</p>
          </TabPanel>
        </TabPanels>
      </Tabs>
    </PageLayout>
  );
};

App.requiresAuth = true;
export default App;
