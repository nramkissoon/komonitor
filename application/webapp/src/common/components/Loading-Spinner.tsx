import { Box, Center, Spinner, useColorModeValue } from "@chakra-ui/react";
import React from "react";

export const LoadingSpinner = () => {
  return (
    <Center w="80%" mt="10em" mb="5em" mx="auto">
      <Spinner
        w="30px"
        h="30px"
        thickness="3px"
        speed=".8s"
        emptyColor={useColorModeValue("gray.200", "gray.700")}
        color={useColorModeValue("blue.300", "blue.300")}
      />{" "}
      <Box fontSize="xl" ml="10px">
        Loading data...
      </Box>
    </Center>
  );
};
