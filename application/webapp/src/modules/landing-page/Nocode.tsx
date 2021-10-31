import { chakra, Flex, useColorModeValue } from "@chakra-ui/react";
import { Copy } from "./constants";

export function NoCode() {
  return (
    <Flex mb="4em" flexDir="column" alignItems="center">
      <chakra.h1
        textAlign="center"
        fontSize="5xl"
        fontWeight="extrabold"
        color={useColorModeValue("gray.800", "gray.100")}
        lineHeight="shorter"
        mb="1.3em"
      >
        {Copy.NoCode.Header}
      </chakra.h1>
    </Flex>
  );
}
