import { Center, Spinner, useColorModeValue } from "@chakra-ui/react";
import React from "react";

export const LoadingSpinner = () => {
  return (
    <Center w="80%" mt="10em" mb="5em" mx="auto">
      <Spinner
        w="300px"
        h="300px"
        thickness="10px"
        speed=".8s"
        emptyColor={useColorModeValue("gray.200", "gray.700")}
        color={useColorModeValue("blue.300", "blue.300")}
      />
    </Center>
  );
};
