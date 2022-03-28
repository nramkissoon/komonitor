import { Box, Button, chakra, Flex, useColorModeValue } from "@chakra-ui/react";
import Link from "next/link";
import { Copy } from "./constants";

const CtaButton = () => {
  return (
    <Link href={"/auth/signin"} passHref>
      <Button
        colorScheme="blue"
        bgColor="blue.300"
        fontSize="xl"
        fontWeight="medium"
        color="white"
        _hover={{
          bg: "blue.600",
        }}
        shadow="lg"
        mb=".5em"
        w={"fit-content"}
        py="1em"
        px="1em"
      >
        Start monitoring today
      </Button>
    </Link>
  );
};

export function CTA() {
  return (
    <Flex
      as="section"
      flexDir="column"
      alignItems="center"
      bg={useColorModeValue("white", "gray.950")}
      borderRadius="3xl"
      shadow="xl"
      pt="2.5em"
      pb="1em"
      px="2em"
      m="auto"
      mb="5em"
    >
      <Box>
        <chakra.h2
          textAlign="center"
          fontSize="5xl"
          fontWeight="extrabold"
          color={useColorModeValue("gray.800", "gray.100")}
          lineHeight="shorter"
          mb=".2em"
        >
          {Copy.Cta.Header}
        </chakra.h2>

        <chakra.h3
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
        </chakra.h3>
      </Box>

      {CtaButton()}

      <chakra.h3 color="gray.500" textAlign="center" mb="2em" fontSize="large">
        {Copy.Cta.CtaButtonHelper}
      </chakra.h3>
    </Flex>
  );
}
