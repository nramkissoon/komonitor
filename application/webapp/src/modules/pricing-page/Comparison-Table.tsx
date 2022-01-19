import {
  Box,
  chakra,
  Fade,
  Flex,
  Heading,
  Icon,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  useColorModeValue,
} from "@chakra-ui/react";
import React from "react";
import { v4 as uuidv4 } from "uuid";
import { PLAN_PRICE_IDS, PLAN_PRODUCT_IDS } from "../billing/plans";
import { CtaButton, ctaButtonCharacteristics } from "./Pricing-Cards";

function TableSectionRow(borderColor: string, title: string) {
  return (
    <Tr bg={useColorModeValue("gray.50", "gray.900")}>
      <Td py={2} fontSize="md" color="gray.500" borderColor={borderColor}>
        {title}
      </Td>
      <Td py={2} borderColor={borderColor}></Td>
      <Td py={2} borderColor={borderColor}></Td>
      <Td py={2} borderColor={borderColor}></Td>
    </Tr>
  );
}

function TableRows(borderColor: string, data: (string | Function)[][]) {
  const color = useColorModeValue("blue.500", "blue.300");
  return data.map((row) => (
    <Tr key={uuidv4()}>
      {row.map((cell) => (
        <Td key={uuidv4()} borderColor={borderColor}>
          {typeof cell === "string" ? cell : cell(color)}
        </Td>
      ))}
    </Tr>
  ));
}

function CheckIcon(color: string) {
  return (
    <Flex shrink={0}>
      <Icon
        boxSize={5}
        mt={1}
        mr={2}
        color={color}
        viewBox="0 0 20 20"
        fill="currentColor"
      >
        <path
          fillRule="evenodd"
          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
          clipRule="evenodd"
        ></path>
      </Icon>
    </Flex>
  );
}

const monitorSectionData = [
  ["Uptime", "5 Monitors", "50 Monitors", "500 Monitors"],
  ["HTTP API Uptime", CheckIcon, CheckIcon, CheckIcon],
  ["Lighthouse*", "1 Monitor", "10 Monitors", "30 Monitors"],
  ["Uptime Check Frequency", "5 minutes", "1 minute", "1 minute"],
  ["Lighthouse Check Frequency*", "7 days", "1 day", "1 day"],
  ["Webhook updates", "-", CheckIcon, CheckIcon],
  ["Regions", "16", "16", "16"],
];

const alertSectionData = [
  ["Email Alerts", CheckIcon, CheckIcon, CheckIcon],
  ["Slack Alerts", CheckIcon, CheckIcon, CheckIcon],
  ["Email Recipients per Alert", "1", "5", "10"],
];

const dataSectionData = [["Data Retention", "7 days", "30 days", "365 days"]];

const supportSectionData = [
  [
    "Support",
    "Basic email support",
    "Priority support",
    "Highest priority support",
  ],
  [
    "Onboarding",
    "Self onboarding",
    "Complimentary onboarding",
    "Complimentary onboarding",
  ],
  ["Account limits", "Fixed", "Fixed", "Customizable on request"],
];

export function ComparisonTable({
  user,
  productId,
  showAnnualPricing,
}: {
  showAnnualPricing: boolean;
  productId: string | undefined;
  user: any;
}) {
  const tableBorderColor = useColorModeValue("gray.100", "gray.700");
  return (
    <Fade in={true}>
      <Box
        w="100%"
        shadow="lg"
        bg={useColorModeValue("white", "#0f131a")}
        borderRadius="lg"
        p="1.5em"
        mb="10px"
      >
        <Heading textAlign="center" fontSize="2xl" fontWeight="bold" mb=".7em">
          Plan Comparison
        </Heading>
        <Box
          overflow="auto"
          css={{
            "&::-webkit-scrollbar": {
              width: "10px",
              height: "10px",
            },
            "&::-webkit-scrollbar-track": {
              width: "10px",
              height: "10px",
            },
            "&::-webkit-scrollbar-thumb": {
              background: useColorModeValue("#E2E8F0", "#1A202C"),
            },
          }}
        >
          <Table>
            <Thead>
              <Tr>
                <Th
                  fontSize="sm"
                  fontWeight="medium"
                  borderColor={tableBorderColor}
                ></Th>
                <Th
                  fontSize="sm"
                  fontWeight="medium"
                  borderColor={tableBorderColor}
                >
                  Free
                </Th>
                <Th
                  fontSize="sm"
                  fontWeight="medium"
                  borderColor={tableBorderColor}
                >
                  Freelancer
                </Th>
                <Th
                  fontSize="sm"
                  fontWeight="medium"
                  borderColor={tableBorderColor}
                >
                  Business
                </Th>
              </Tr>
            </Thead>
            <Tbody>
              {TableSectionRow(tableBorderColor, "Monitors")}
              {TableRows(tableBorderColor, monitorSectionData)}
              {TableSectionRow(tableBorderColor, "Alerts")}
              {TableRows(tableBorderColor, alertSectionData)}
              {TableSectionRow(tableBorderColor, "Data")}
              {TableRows(tableBorderColor, dataSectionData)}
              {TableSectionRow(tableBorderColor, "Support")}
              {TableRows(tableBorderColor, supportSectionData)}
              <Tr>
                <Td py={2} borderColor={tableBorderColor}></Td>
                <Td py={2} borderColor={tableBorderColor}>
                  <CtaButton
                    width="13em"
                    {...ctaButtonCharacteristics(
                      user,
                      productId,
                      PLAN_PRODUCT_IDS.FREE,
                      showAnnualPricing
                        ? PLAN_PRICE_IDS.ANNUAL.FREE
                        : PLAN_PRICE_IDS.MONTHLY.FREE
                    )}
                  />
                </Td>
                <Td py={2} borderColor={tableBorderColor}>
                  <CtaButton
                    width="13em"
                    {...ctaButtonCharacteristics(
                      user,
                      productId,
                      PLAN_PRODUCT_IDS.FREELANCER,
                      showAnnualPricing
                        ? PLAN_PRICE_IDS.ANNUAL.FREELANCER
                        : PLAN_PRICE_IDS.MONTHLY.FREELANCER
                    )}
                  />
                </Td>
                <Td py={2} borderColor={tableBorderColor}>
                  <CtaButton
                    width="13em"
                    {...ctaButtonCharacteristics(
                      user,
                      productId,
                      PLAN_PRODUCT_IDS.BUSINESS,
                      showAnnualPricing
                        ? PLAN_PRICE_IDS.ANNUAL.BUSINESS
                        : PLAN_PRICE_IDS.MONTHLY.BUSINESS
                    )}
                  />
                </Td>
              </Tr>
            </Tbody>
          </Table>
        </Box>
      </Box>
      <chakra.p color="gray.500" fontSize="sm" mb="3em">
        * feature coming soon
      </chakra.p>
    </Fade>
  );
}
