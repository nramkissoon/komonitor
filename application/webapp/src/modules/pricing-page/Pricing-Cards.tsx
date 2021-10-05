import {
  Badge,
  Box,
  chakra,
  Fade,
  Flex,
  SimpleGrid,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import { useSession } from "next-auth/client";
import Link from "next/link";
import React from "react";
import { LoadingSpinner } from "../../common/components/Loading-Spinner";
import { useUserServicePlanProductId } from "../user/client";

interface PricingCardProps {
  price: number;
  planName: string;
}

function PricingCard(props: PricingCardProps) {
  const { price, planName } = props;
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
            mb={1}
            fontSize="xs"
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
          <Link passHref href="/auth/signin">
            <Box
              href=""
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
              Get started
            </Box>
          </Link>
        </Box>
      </Flex>
    </Box>
  );
}

function ctaButtonCharacteristics(
  user: any,
  userProductId: any,
  productId: string
) {
  const isCurrentPlan = userProductId === productId;
  const isSignedIn = user !== undefined && user !== null;
  let text = isCurrentPlan
    ? "Go to App"
    : isSignedIn
    ? "Manage Subscription"
    : "Get Started";
  let href = isCurrentPlan
    ? "/app/"
    : isSignedIn
    ? "/app/settings/tab=billing"
    : "/auth/signin";
  return {
    text: text,
    href: href,
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
        <LoadingSpinner />
      ) : (
        <Fade in={!isLoading && !isError}>
          <Box mb="2">
            <SimpleGrid columns={[1, null, null, 3]} gap={[16, 8]}>
              <PricingCard price={0} planName={"Free"} />
            </SimpleGrid>
          </Box>
        </Fade>
      )}
    </>
  );
}
