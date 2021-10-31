import { Box, Button, chakra, Flex, useColorModeValue } from "@chakra-ui/react";
import Link from "next/link";
import { Copy } from "./constants";

const CtaButton = () => {
  return (
    <Link href={"/auth/signin"} passHref>
      <Button
        size="lg"
        colorScheme="blue"
        bgColor="blue.300"
        fontSize="3xl"
        fontWeight="bold"
        color="white"
        _hover={{
          bg: "blue.600",
        }}
        shadow="lg"
        mb=".5em"
        py="1em"
        px="1em"
      >
        {Copy.Cta.CtaButtonText}
      </Button>
    </Link>
  );
};

export function CTA() {
  return (
    <Flex
      mb="5em"
      flexDir="column"
      alignItems="center"
      bg={useColorModeValue("white", "#0f131a")}
      borderRadius="2xl"
      shadow="xl"
      pt="2.5em"
      pb="1em"
    >
      <Box>
        <chakra.h1
          textAlign="center"
          fontSize="5xl"
          fontWeight="extrabold"
          color={useColorModeValue("gray.800", "gray.100")}
          lineHeight="shorter"
          mb=".2em"
        >
          {Copy.Cta.Header}
        </chakra.h1>

        <chakra.h2
          fontSize="3xl"
          fontWeight="bold"
          textAlign="center"
          lineHeight="shorter"
          w={["70%"]}
          mx="auto"
          color={useColorModeValue("gray.600", "gray.400")}
          mb="1.2em"
        >
          {Copy.Cta.Subheader}
        </chakra.h2>
      </Box>

      {CtaButton()}

      <chakra.h3 color="gray.500" textAlign="center" mb="2em" fontSize="large">
        {Copy.Cta.CtaButtonHelper}
      </chakra.h3>
    </Flex>
  );
}
