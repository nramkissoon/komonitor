import { Box, Heading, Text, useColorModeValue } from "@chakra-ui/react";
import React from "react";

export function PricingHeader() {
  return (
    <Box textAlign="center" pt="2em">
      <Heading fontSize="5xl" fontWeight="bold" mb="5">
        Plans & Pricing
      </Heading>
      <Text
        mb="5em"
        fontSize="lg"
        color={useColorModeValue("gray.600", "gray.400")}
      >
        Simple pricing plans to match your needs and scale. Cancel anytime, no
        questions asked.
      </Text>
    </Box>
  );
}
