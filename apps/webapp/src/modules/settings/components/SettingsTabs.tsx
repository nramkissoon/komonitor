import {
  Box,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  useColorModeValue,
  useMediaQuery,
} from "@chakra-ui/react";
import { AccountTab } from "./AccountTab";
import { DevelopersTab } from "./DeveloperTab";

interface SettingsTabsProps {
  initialTab: number;
}

export function SettingsTabs(props: SettingsTabsProps) {
  const { initialTab } = props;
  const [isLargerThan1280] = useMediaQuery("(min-width: 1280px)");

  const tabStyles = {
    pl: isLargerThan1280 ? 2 : 5,
    pr: isLargerThan1280 ? 0 : 5,
    py: 0,
    mb: "5px",
    rounded: "sm",
    _hover: { bg: useColorModeValue("gray.200", "gray.500") },
    justifyContent: "left",
    fontSize: "lg",
    _selected: {
      bg: useColorModeValue("gray.200", "gray.700"),
    },
  };

  const orientation = isLargerThan1280 ? "vertical" : "horizontal";

  return (
    <Box w="100%" borderRadius="xl">
      <Tabs
        defaultIndex={initialTab ? initialTab : 0}
        orientation={orientation}
        variant="unstyled"
      >
        <TabList w="225px" mr="10px" mt="20px">
          <Tab {...tabStyles}>Account</Tab>
          <Tab {...tabStyles}>Developers</Tab>
        </TabList>
        <TabPanels>
          <TabPanel p="0">
            <AccountTab />
          </TabPanel>
          <TabPanel p="0">
            <DevelopersTab />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Box>
  );
}
