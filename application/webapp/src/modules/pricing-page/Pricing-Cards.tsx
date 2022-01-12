import {
  Badge,
  Box,
  chakra,
  Flex,
  Icon,
  SimpleGrid,
  Stack,
  Switch,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import { useSession } from "next-auth/client";
import router from "next/router";
import React from "react";
import { PLAN_PRICE_IDS, PLAN_PRODUCT_IDS } from "../billing/plans";
import { useUserServicePlanProductId } from "../user/client";

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
  FREE: [
    "Free forever",
    "Access to uptime, browser, and Google Lighthouse checks",
    "Good for testing simple applications that could scale later",
    "Basic email alerting",
    "7-day data retention",
  ],
  FREELANCER: [
    "Monitor several websites in production",
    "Advanced alerting + integration with messaging services",
    "Priority support and onboarding",
    "30-day data retention",
  ],
  BUSINESS: [
    "Scale to hundreds of monitors in production",
    "Advanced alerting + integration with messaging services",
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
          boxSize={5}
          mt={1}
          mr={2}
          color={useColorModeValue("blue.500", "blue.300")}
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
      <Box ml={4}>
        <chakra.span mt={2} color={useColorModeValue("gray.700", "gray.400")}>
          {feature}
        </chakra.span>
      </Box>
    </Flex>
  );
}

function PricingCard(props: PricingCardProps) {
  const { price, planName, ctaButtonProps, featureList, showAnnual } = props;

  let perString = "/month";
  if (planName === "Free") {
    perString = " Forever";
  }

  return (
    <Box
      rounded="lg"
      shadow="md"
      pt={10}
      bg={useColorModeValue("white", "#0f131a")}
    >
      <Flex direction="column">
        <Box px={10} pb={5}>
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
            {planName}
          </Badge>
          <Text
            mb={2}
            fontSize="5xl"
            fontWeight={["bold", "extrabold"]}
            color={useColorModeValue("gray.900", "gray.50")}
            lineHeight="tight"
          >
            ${showAnnual ? price - price * 0.3 : price}
            <chakra.span
              fontSize="2xl"
              fontWeight="medium"
              color={useColorModeValue("gray.600", "gray.400")}
            >
              {perString}
            </chakra.span>
          </Text>
          <Box
            as="button"
            onClick={() => ctaButtonProps.onClickFunc()}
            w={["full"]}
            display="inline-flex"
            alignItems="center"
            justifyContent="center"
            px={4}
            py={3}
            border="solid transparent"
            fontWeight="bold"
            letterSpacing="wide"
            fontSize="xl"
            rounded="md"
            shadow="md"
            color="white"
            bg={useColorModeValue("blue.400", "blue.500")}
            _hover={{
              bg: useColorModeValue("blue.600", "blue.700"),
              cursor: "pointer",
            }}
          >
            {ctaButtonProps.text}
          </Box>
        </Box>
        <Flex px={10} pt={5} pb={10} direction="column">
          <Stack mb={5} spacing={4}>
            {featureList.map((feature) => Feature(feature, planName + feature))}
          </Stack>
        </Flex>
      </Flex>
    </Box>
  );
}

function ctaButtonCharacteristics(
  user: any,
  userProductId: any,
  productId: string,
  priceId: string
) {
  const isCurrentPlan = userProductId === productId;
  const isSignedIn = user !== undefined && user !== null;
  let text = isCurrentPlan
    ? "Go to Dashboard"
    : isSignedIn
    ? userProductId === PLAN_PRODUCT_IDS.FREE
      ? "Upgrade Subscription"
      : "Manage Subscription"
    : "Get Started";
  let onClickFunc = isCurrentPlan
    ? () => router.push("/app/")
    : isSignedIn
    ? userProductId === PLAN_PRODUCT_IDS.FREE
      ? async () => {
          const res = await fetch("/api/billing/checkout-session", {
            method: "POST",
            body: JSON.stringify(priceId),
          });
          const stripeUrl = (await res.json()).url;
          router.push(stripeUrl);
        }
      : () => router.push("/app/settings?tab=1")
    : () => router.push("/auth/signin");
  return {
    text: text,
    onClickFunc: onClickFunc,
  };
}

export function PricingCards() {
  const [session, loading] = useSession();
  const {
    data,
    isLoading: userServicePlanIsLoading,
    isError,
  } = useUserServicePlanProductId();

  const [showAnnualPricing, setShowAnnualPricing] = React.useState(false);

  const user = session && session?.user;
  const productId = data ? data.productId : undefined;

  let isLoading = userServicePlanIsLoading || loading;

  return (
    <>
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
        <SimpleGrid columns={[1, null, null, 3]} gap={[16, 8]}>
          <PricingCard
            price={0}
            planName={"Free"}
            ctaButtonProps={ctaButtonCharacteristics(
              user,
              productId,
              PLAN_PRODUCT_IDS.FREE,
              showAnnualPricing
                ? PLAN_PRICE_IDS.ANNUAL.FREE
                : PLAN_PRICE_IDS.MONTHLY.FREE
            )}
            featureList={planFeatureList["FREE"]}
            showAnnual={showAnnualPricing}
          />
          <PricingCard
            price={25}
            planName={"Freelancer"}
            ctaButtonProps={ctaButtonCharacteristics(
              user,
              productId,
              PLAN_PRODUCT_IDS.FREELANCER,
              showAnnualPricing
                ? PLAN_PRICE_IDS.ANNUAL.FREELANCER
                : PLAN_PRICE_IDS.MONTHLY.FREELANCER
            )}
            featureList={planFeatureList["FREELANCER"]}
            showAnnual={showAnnualPricing}
          />
          <PricingCard
            price={80}
            planName={"Business"}
            ctaButtonProps={ctaButtonCharacteristics(
              user,
              productId,
              PLAN_PRODUCT_IDS.BUSINESS,
              showAnnualPricing
                ? PLAN_PRICE_IDS.ANNUAL.BUSINESS
                : PLAN_PRICE_IDS.MONTHLY.BUSINESS
            )}
            featureList={planFeatureList["BUSINESS"]}
            showAnnual={showAnnualPricing}
          />
        </SimpleGrid>
      </Flex>
    </>
  );
}
