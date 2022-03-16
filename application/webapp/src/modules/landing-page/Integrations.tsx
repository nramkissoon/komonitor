import { chakra, Flex, Grid, useColorModeValue } from "@chakra-ui/react";

export const IntegrationSection = () => {
  return (
    <Flex flexDir="column" alignItems="center" as="section">
      <chakra.h2
        textAlign="center"
        fontSize="5xl"
        fontWeight="extrabold"
        color={useColorModeValue("gray.800", "gray.100")}
        lineHeight="shorter"
        mb="10px"
      >
        Integrate With Your Favorite Tools
      </chakra.h2>
      <chakra.h3
        fontSize="2xl"
        fontWeight="bold"
        textAlign="center"
        lineHeight="shorter"
        w={["70%"]}
        mx="auto"
        color={useColorModeValue("gray.600", "gray.400")}
        mb="2em"
      >
        Receive alerts and updates via services you and your team already use.
      </chakra.h3>
      <Grid
        templateColumns={[
          "repeat(1, 1fr)",
          null,
          null,
          null,
          null,
          "repeat(4, 1fr)",
        ]}
        gap={6}
        maxW="9xl"
        mb="10px"
      ></Grid>
    </Flex>
  );
};
