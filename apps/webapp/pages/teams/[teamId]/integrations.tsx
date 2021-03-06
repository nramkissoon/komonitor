import {
  Alert,
  AlertDescription,
  AlertIcon,
  Heading,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  useColorModeValue,
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import { useAppBaseRoute } from "../../../src/common/client-utils";
import { AppSubNav } from "../../../src/common/components/App-Sub-Nav";
import { PageLayout } from "../../../src/common/components/Page-Layout";
import { useIntegrations } from "../../../src/modules/integrations/client";
import { ActiveIntegrationList } from "../../../src/modules/integrations/components/ActiveIntegrationList";
import { NewIntegrationsList } from "../../../src/modules/integrations/components/NewIntegrationsList";
import { ExtendedNextPage } from "../../_app";

const App: ExtendedNextPage = () => {
  const router = useRouter();
  const {
    slackAlreadyInstalled,
    slackIntegrationSuccess,
    slackIntegrationCanceled,
    discordIntegrationSuccess,
    discordAlreadyInstalled,
  } = router.query;
  const baseRoute = useAppBaseRoute();

  const { integrations, isLoading } = useIntegrations();

  return (
    <PageLayout isAppPage maxW={["sm", "xl", "3xl", "5xl", "6xl"]}>
      <AppSubNav
        links={[
          { isSelected: false, href: baseRoute, text: "Projects" },
          {
            isSelected: true,
            href: baseRoute + "/integrations",
            text: "Integrations",
          },
          {
            isSelected: false,
            href: baseRoute + "/settings",
            text: "Settings",
          },
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
        These integrations are available in any project in your team.
      </Heading>
      {slackAlreadyInstalled === "true" && (
        <Alert status="warning" mt="-.2em" mb=".5em" variant="left-accent">
          <AlertIcon />
          <AlertDescription>
            Slack already integrated with given workspace and channel.
          </AlertDescription>
        </Alert>
      )}
      {slackIntegrationSuccess === "true" && (
        <Alert status="success" mt="-.2em" mb=".5em" variant="left-accent">
          <AlertIcon />
          <AlertDescription>Slack successfully installed!</AlertDescription>
        </Alert>
      )}
      {slackIntegrationSuccess === "false" && (
        <Alert status="error" mt="-.2em" mb=".5em" variant="left-accent">
          <AlertIcon />
          <AlertDescription>
            Slack installation failed, please try again later.
          </AlertDescription>
        </Alert>
      )}
      {slackIntegrationCanceled === "true" && (
        <Alert status="warning" mt="-.2em" mb=".5em" variant="left-accent">
          <AlertIcon />
          <AlertDescription>Slack integration canceled.</AlertDescription>
        </Alert>
      )}
      {discordAlreadyInstalled === "true" && (
        <Alert status="warning" mt="-.2em" mb=".5em" variant="left-accent">
          <AlertIcon />
          <AlertDescription>
            Discord already integrated with given server and channel.
          </AlertDescription>
        </Alert>
      )}
      {discordIntegrationSuccess === "true" && (
        <Alert status="success" mt="-.2em" mb=".5em" variant="left-accent">
          <AlertIcon />
          <AlertDescription>Discord successfully integrated!</AlertDescription>
        </Alert>
      )}
      {discordIntegrationSuccess === "false" && (
        <Alert status="error" mt="-.2em" mb=".5em" variant="left-accent">
          <AlertIcon />
          <AlertDescription>
            Discord integrations failed, please try again later.
          </AlertDescription>
        </Alert>
      )}
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
            <ActiveIntegrationList
              integrations={integrations}
              isLoading={isLoading}
            />
          </TabPanel>
          <TabPanel px="0">
            <NewIntegrationsList />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </PageLayout>
  );
};

App.requiresAuth = true;
export default App;
