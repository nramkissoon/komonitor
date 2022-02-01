import { Box, Heading, Text, useColorModeValue } from "@chakra-ui/react";
import React from "react";

export function PricingHeader() {
  return (
    <Box textAlign="center" pt="1em">
      <Heading fontSize="7xl" fontWeight="extrabold" mb="4">
        Plans & Pricing
      </Heading>
      <Text
        mb="3em"
        fontWeight="bold"
        fontSize="2xl"
        color={useColorModeValue("gray.600", "gray.400")}
      >
        Simple pricing plans that save you hundreds of dollars during an outage.
      </Text>
    </Box>
  );
}
