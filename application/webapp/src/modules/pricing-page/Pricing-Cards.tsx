import {
  Badge,
  Box,
  Button,
  chakra,
  Divider,
  Flex,
  Icon,
  SimpleGrid,
  Stack,
  Switch,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import { noop } from "lodash";
import router from "next/router";
import React from "react";
import { NewTeamDialog } from "../../common/components/New-Team-Dialog";
import { PLAN_PRICE_IDS, PLAN_PRODUCT_IDS } from "../billing/plans";

interface PricingCardProps {
  price: number;
  planName: string;
  ctaButtonProps: {
    text: string;
    onClickFunc: Function;
  };
  featureList: string[];
  showAnnual: boolean;
}

const planFeatureList: { [productId: string]: string[] } = {
  STARTER: [
    "Try out our monitoring solutions at no cost",
    "Monitor websites and APIs",
    "Alerting + integrations with your favorite tools",
    "Monitor website latency, API responses, and more",
    "90-day data retention",
  ],
  PRO: [
    "Invite up to 10 team members",
    "5x faster uptime checks",
    "Monitor hundreds websites and APIs in production",
    "Alerting + integrations with your favorite tools",
    "Priority support and onboarding",
    "365-day data retention",
  ],
  BUSINESS: [
    "Invite up to 20 team members",
    "Scale to thousands of monitors in production",
    "Advanced alerting + integrations with your favorite tools",
    "Highest priority support and onboarding",
    "Custom service limits to suit business needs",
    "365-day data retention",
  ],
};

function Feature(feature: string, key: string) {
  return (
    <Flex align="center" key={key}>
      <Flex shrink={0}>
        <Icon
          boxSize={7}
          mt={1}
          mr={2}
          color={useColorModeValue("blue.500", "blue.300")}
          viewBox="0 0 20 20"
          fill="green.500"
        >
          <path
            fillRule="evenodd"
            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
            clipRule="evenodd"
          ></path>
        </Icon>
      </Flex>
      <Box ml={4}>
        <chakra.span
          mt={2}
          color={useColorModeValue("gray.700", "gray.400")}
          fontSize="lg"
        >
          {feature}
        </chakra.span>
      </Box>
    </Flex>
  );
}

const StarterPricingCard = ({
  ctaButtonProps,
}: {
  ctaButtonProps: {
    text: string;
    onClickFunc: Function;
  };
}) => {
  return (
    <Box
      boxSizing="border-box"
      rounded="lg"
      shadow="md"
      pt={10}
      bg={useColorModeValue("white", "gray.950")}
      borderWidth="1px"
      transitionDuration="300ms"
      _hover={{
        borderWidth: "1px",
        borderColor: "blue.300",
        transform: "scale(1.05)",
      }}
    >
      <Flex direction="column" h="full">
        <Box px={10} maxH="200px">
          <Badge
            mb={2}
            fontSize="sm"
            letterSpacing="wide"
            colorScheme="gray"
            fontWeight="medium"
            rounded="full"
            px={4}
            py={1}
          >
            Starter
          </Badge>
          <Text
            fontSize="5xl"
            fontWeight={["bold", "extrabold"]}
            color={useColorModeValue("gray.900", "gray.50")}
            lineHeight="tight"
          >
            ${0}{" "}
            <chakra.span
              fontSize="2xl"
              fontWeight="medium"
              color={useColorModeValue("gray.600", "gray.400")}
            >
              Forever
            </chakra.span>
          </Text>
          <Text
            fontSize="2xl"
            fontWeight={["bold", "extrabold"]}
            color={useColorModeValue("gray.600", "gray.400")}
            lineHeight="tight"
          >
            Get started with monitoring for free.
          </Text>
        </Box>
        <Divider mt={5} borderColor="gray.400" />
        <Flex
          pt={5}
          pb={5}
          px={10}
          direction="column"
          bg={useColorModeValue("white", "black")}
          flexGrow={1}
        >
          <Stack spacing={4}>
            {planFeatureList["STARTER"].map((feature) =>
              Feature(feature, "STARTER" + feature)
            )}
          </Stack>
        </Flex>
        <Divider mb={5} borderColor="gray.400" />
        <Box px={12} mb={5}>
          <CtaButton {...ctaButtonProps} />
        </Box>
      </Flex>
    </Box>
  );
};

const ProPricingCard = ({
  ctaButtonProps,
  showAnnual,
}: {
  showAnnual: boolean;
  ctaButtonProps: {
    text: string;
    onClickFunc: Function;
  };
}) => {
  return (
    <Box
      boxSizing="border-box"
      rounded="lg"
      shadow="md"
      pt={10}
      bg={useColorModeValue("white", "gray.950")}
      borderWidth="1px"
      transitionDuration="300ms"
      _hover={{
        borderWidth: "1px",
        borderColor: "blue.300",
        transform: "scale(1.05)",
      }}
    >
      <Flex direction="column" h="full">
        <Box px={10} maxH="200px">
          <Badge
            mb={2}
            fontSize="sm"
            letterSpacing="wide"
            colorScheme="green"
            fontWeight="medium"
            rounded="full"
            px={4}
            py={1}
          >
            Pro
          </Badge>
          <Text
            fontSize="5xl"
            fontWeight={["bold", "extrabold"]}
            color={useColorModeValue("gray.900", "gray.50")}
            lineHeight="tight"
          >
            ${showAnnual ? 25 - 25 * 0.3 : 25}
            <chakra.span
              fontSize="2xl"
              fontWeight="medium"
              color={useColorModeValue("gray.600", "gray.400")}
            >
              /month
            </chakra.span>
          </Text>
          <Text
            fontSize="2xl"
            fontWeight={["bold", "extrabold"]}
            color={useColorModeValue("gray.600", "gray.400")}
            lineHeight="tight"
          >
            Create a team and monitor applications.
          </Text>
        </Box>
        <Divider mt={5} borderColor="gray.400" />
        <Flex
          pt={5}
          pb={5}
          px={10}
          direction="column"
          bg={useColorModeValue("white", "black")}
          flexGrow={1}
        >
          <Stack spacing={4}>
            {planFeatureList["PRO"].map((feature) =>
              Feature(feature, "PRO" + feature)
            )}
          </Stack>
        </Flex>
        <Divider mb={5} borderColor="gray.400" />
        <Box px={12} mb={5}>
          <CtaButton {...ctaButtonProps} />
        </Box>
      </Flex>
    </Box>
  );
};

const BusinessPricingCard = ({
  ctaButtonProps,
  showAnnual,
}: {
  showAnnual: boolean;
  ctaButtonProps: {
    text: string;
    onClickFunc: Function;
  };
}) => {
  return (
    <Box
      boxSizing="border-box"
      rounded="lg"
      shadow="md"
      pt={10}
      bg={useColorModeValue("white", "gray.950")}
      borderWidth="1px"
      transitionDuration="300ms"
      _hover={{
        borderWidth: "1px",
        borderColor: "blue.300",
        transform: "scale(1.05)",
      }}
    >
      <Flex direction="column" h="full">
        <Box px={10} maxH="200px">
          <Badge
            mb={2}
            fontSize="sm"
            letterSpacing="wide"
            colorScheme="purple"
            fontWeight="medium"
            rounded="full"
            px={4}
            py={1}
          >
            Business
          </Badge>
          <Text
            fontSize="5xl"
            fontWeight={["bold", "extrabold"]}
            color={useColorModeValue("gray.900", "gray.50")}
            lineHeight="tight"
          >
            ${showAnnual ? 80 - 80 * 0.3 : 80}
            <chakra.span
              fontSize="2xl"
              fontWeight="medium"
              color={useColorModeValue("gray.600", "gray.400")}
            >
              /month
            </chakra.span>
          </Text>
          <Text
            fontSize="2xl"
            fontWeight={["bold", "extrabold"]}
            color={useColorModeValue("gray.600", "gray.400")}
            lineHeight="tight"
          >
            Critical monitoring and alerting at scale.
          </Text>
        </Box>
        <Divider mt={5} borderColor="gray.400" />
        <Flex
          pt={5}
          pb={5}
          px={10}
          direction="column"
          bg={useColorModeValue("white", "black")}
          flexGrow={1}
        >
          <Stack spacing={4}>
            {planFeatureList["BUSINESS"].map((feature) =>
              Feature(feature, "BUSINESS" + feature)
            )}
          </Stack>
        </Flex>
        <Divider mb={5} borderColor="gray.400" />
        <Box px={12} mb={5}>
          <CtaButton {...ctaButtonProps} />
        </Box>
      </Flex>
    </Box>
  );
};

export const CtaButton = ({
  text,
  onClickFunc,
  width,
}: {
  text: string;
  onClickFunc: Function;
  width?: string;
}) => {
  return (
    <Button
      size="lg"
      onClick={() => onClickFunc()}
      w={width ? width : ["full"]}
      display="inline-flex"
      alignItems="center"
      justifyContent="center"
      px={4}
      py={3}
      fontWeight="bold"
      letterSpacing="wide"
      fontSize="xl"
      rounded="md"
      shadow="md"
      color="white"
      bg="blue.400"
      transitionDuration="200ms"
      _hover={{
        bg: "blue.600",
        cursor: "pointer",
      }}
    >
      {text}
    </Button>
  );
};

export function ctaButtonCharacteristics(
  user: any,
  userProductId: any,
  productId: string,
  setPriceId: React.Dispatch<React.SetStateAction<string>>,
  priceId: string,
  onOpen: React.Dispatch<React.SetStateAction<boolean>>
) {
  const isCurrentPlan = userProductId === productId;
  const isSignedIn = user !== undefined && user !== null;
  let text = "";
  if (isSignedIn) {
    if (PLAN_PRODUCT_IDS.STARTER === productId) {
      text = "Go to Dashboard";
    } else {
      text = "Try Free for 14 Days";
    }
  } else {
    text = "Get Started";
  }

  let onClickFunc = noop;

  if (isCurrentPlan && userProductId === PLAN_PRODUCT_IDS.STARTER) {
    onClickFunc = () => router.push("/app/");
  } else if (!isSignedIn) {
    onClickFunc = () => router.push("/auth/signin");
  } else {
    onClickFunc = () => {
      setPriceId(priceId);
      onOpen(true);
    };
  }
  return {
    text: text,
    onClickFunc: onClickFunc,
  };
}

export function PricingCards(props: {
  showAnnualPricing: boolean;
  setShowAnnualPricing: React.Dispatch<React.SetStateAction<boolean>>;
  productId: string | undefined;
  user: any;
}) {
  const { showAnnualPricing, setShowAnnualPricing, productId, user } = props;
  const [createNewTeamIsOpen, setCreateNewTeamIsOpen] = React.useState(false);
  const [planPricingId, setPlanPricingId] = React.useState(
    PLAN_PRICE_IDS.MONTHLY.PRO
  );

  console.log();
  return (
    <>
      <NewTeamDialog
        isOpen={createNewTeamIsOpen}
        onClose={() => setCreateNewTeamIsOpen(false)}
        defaultPlanValue={planPricingId}
      />
      <Flex
        mb="1.7em"
        justifyContent="center"
        alignItems="center"
        flexDir="column"
      >
        <Flex mb="2em" maxW="4xl">
          <chakra.p fontSize={["lg", "2xl"]} mr="1em" fontWeight="medium">
            Monthly Billing
          </chakra.p>
          <Switch
            defaultChecked={showAnnualPricing}
            isChecked={showAnnualPricing}
            size="lg"
            mt="1"
            onChange={(e) => setShowAnnualPricing(e.target.checked)}
          />
          <Box ml="1em">
            <chakra.p fontSize={["lg", "2xl"]} fontWeight="medium">
              Annual Billing
            </chakra.p>
            <chakra.p
              textAlign="center"
              fontSize={["lg", "2xl"]}
              color="blue.500"
              fontWeight="bold"
            >
              (Save 30%)
            </chakra.p>
          </Box>
        </Flex>
        <SimpleGrid columns={[1, null, null, null, 3]} gap={[16, 8]}>
          <StarterPricingCard
            ctaButtonProps={ctaButtonCharacteristics(
              user,
              productId,
              PLAN_PRODUCT_IDS.STARTER,
              setPlanPricingId,
              showAnnualPricing
                ? PLAN_PRICE_IDS.ANNUAL.STARTER
                : PLAN_PRICE_IDS.MONTHLY.STARTER,
              setCreateNewTeamIsOpen
            )}
          />
          <ProPricingCard
            ctaButtonProps={ctaButtonCharacteristics(
              user,
              productId,
              PLAN_PRODUCT_IDS.PRO,
              setPlanPricingId,
              showAnnualPricing
                ? PLAN_PRICE_IDS.ANNUAL.PRO
                : PLAN_PRICE_IDS.MONTHLY.PRO,
              setCreateNewTeamIsOpen
            )}
            showAnnual={showAnnualPricing}
          />
          <BusinessPricingCard
            ctaButtonProps={ctaButtonCharacteristics(
              user,
              productId,
              PLAN_PRODUCT_IDS.BUSINESS,
              setPlanPricingId,
              showAnnualPricing
                ? PLAN_PRICE_IDS.ANNUAL.BUSINESS
                : PLAN_PRICE_IDS.MONTHLY.BUSINESS,
              setCreateNewTeamIsOpen
            )}
            showAnnual={showAnnualPricing}
          />
        </SimpleGrid>
      </Flex>
    </>
  );
}
