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

interface SettingsTabsProps {
  initialTab: string;
}

export function SettingsTabs(props: SettingsTabsProps) {
  const { initialTab } = props;

  return (
    <Box
      w="100%"
      shadow="lg"
      bg={useColorModeValue("white", "#0f131a")}
      borderRadius="xl"
      p="1.5em"
      mb="1.5em"
    >
      <Tabs defaultIndex={initialTab === "billing" ? 1 : 0}>
        <TabList mb="1em">
          <Tab>Account</Tab>
          <Tab>Billing</Tab>
        </TabList>
        <TabPanels>
          <TabPanel p="0">
            <AccountTab />
          </TabPanel>
          <TabPanel p="0">
            <BillingTab />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Box>
  );
}
