import {
  Box,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  useColorModeValue,
} from "@chakra-ui/react";
import React from "react";
import { AccountTab } from "./AccountTab";
import { BillingTab } from "./BillingTab";
import { IntegrationsTab } from "./Integrations-Tab";

interface SettingsTabsProps {
  initialTab: number;
}

export function SettingsTabs(props: SettingsTabsProps) {
  const { initialTab } = props;
  return (
    <Box
      w="100%"
      shadow="md"
      bg={useColorModeValue("white", "#0f131a")}
      borderRadius="xl"
      p="1.5em"
      mb="1.5em"
    >
      <Tabs defaultIndex={initialTab ? initialTab : 0}>
        <TabList mb="1em">
          <Tab>Account</Tab>
          <Tab>Billing</Tab>
          <Tab>Integrations</Tab>
        </TabList>
        <TabPanels>
          <TabPanel p="0" px="10px">
            <AccountTab />
          </TabPanel>
          <TabPanel p="0" px="10px">
            <BillingTab />
          </TabPanel>
          <TabPanel p="0" px="10px">
            <IntegrationsTab />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Box>
  );
}
