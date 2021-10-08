import {
  Badge,
  Box,
  chakra,
  Fade,
  Flex,
  Icon,
  SimpleGrid,
  Stack,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import { useSession } from "next-auth/client";
import router from "next/router";
import React from "react";
import { LoadingSpinner } from "../../common/components/Loading-Spinner";
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
  const { price, planName, ctaButtonProps, featureList } = props;
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
            ${price}
            <chakra.span
              fontSize="2xl"
              fontWeight="medium"
              color={useColorModeValue("gray.600", "gray.400")}
            >
              {" "}
              /month
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
            fontWeight="normal"
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
    ? "Go to App"
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
      : () => router.push("/app/settings?tab=billing")
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

  const user = session && session?.user;
  const productId = data ? data.productId : undefined;

  let isLoading = userServicePlanIsLoading || loading;

  return (
    <>
      {isLoading ? (
        <Fade in={isLoading} delay={0.2}>
          <LoadingSpinner />
        </Fade>
      ) : (
        <Fade in={!isLoading && !isError}>
          <Box mb="1.7em">
            <SimpleGrid columns={[1, null, null, 3]} gap={[16, 8]}>
              <PricingCard
                price={0}
                planName={"Free"}
                ctaButtonProps={ctaButtonCharacteristics(
                  user,
                  productId,
                  PLAN_PRODUCT_IDS.FREE,
                  PLAN_PRICE_IDS.FREE
                )}
                featureList={planFeatureList["FREE"]}
              />
              <PricingCard
                price={20}
                planName={"Freelancer"}
                ctaButtonProps={ctaButtonCharacteristics(
                  user,
                  productId,
                  PLAN_PRODUCT_IDS.FREELANCER,
                  PLAN_PRICE_IDS.FREELANCER
                )}
                featureList={planFeatureList["FREELANCER"]}
              />
              <PricingCard
                price={80}
                planName={"Business"}
                ctaButtonProps={ctaButtonCharacteristics(
                  user,
                  productId,
                  PLAN_PRODUCT_IDS.BUSINESS,
                  PLAN_PRICE_IDS.BUSINESS
                )}
                featureList={planFeatureList["BUSINESS"]}
              />
            </SimpleGrid>
          </Box>
        </Fade>
      )}
    </>
  );
}
