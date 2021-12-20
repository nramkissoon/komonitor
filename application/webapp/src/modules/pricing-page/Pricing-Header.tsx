import {
  Box,
  Center,
  chakra,
  Flex,
  Heading,
  Image,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import React from "react";

export function PricingHeader() {
  return (
    <Box textAlign="center" pt="1em">
      <Center>
        <Flex
          mb="2em"
          h="auto"
          bg={useColorModeValue("green.50", "green.700")}
          px="20px"
          py="10px"
          rounded="xl"
          borderWidth="2px"
          borderColor={useColorModeValue("green.200", "green.500")}
          alignItems="center"
          flexDir={["column", null, "row", "row"]}
        >
          <Image
            src="/stripe-climate/badge.svg"
            boxSize={["40px", "45px", "50px"]}
            bg={useColorModeValue("green.50", "gray.200")}
            p="5px"
            borderRadius="lg"
          />{" "}
          <chakra.div
            ml={["3px", "5px", "7px", "10px"]}
            fontSize={["md", null, "lg", "xl"]}
            fontWeight="bold"
            lineHeight={["30px", "30px", "50px"]}
          >
            We partner with{" "}
            <chakra.span
              color={useColorModeValue("#6772e5", "white")}
              fontWeight="extrabold"
            >
              Stripe
            </chakra.span>{" "}
            contribute 1% of our revenue to carbon removal.
          </chakra.div>
        </Flex>
      </Center>
      <Heading fontSize="7xl" fontWeight="extrabold" mb="4">
        Plans & Pricing
      </Heading>
      <Text
        mb="3em"
        fontWeight="bold"
        fontSize="2xl"
        color={useColorModeValue("gray.600", "gray.400")}
      >
        Simple pricing plans to match your needs and scale. Cancel anytime, no
        questions asked.
      </Text>
    </Box>
  );
}
