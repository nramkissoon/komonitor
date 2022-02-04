import {
  Box,
  Button,
  chakra,
  Flex,
  HStack,
  Icon,
  Image,
  useColorModeValue,
} from "@chakra-ui/react";
import Link from "next/link";
import { Copy } from "./constants";

const CircleIcon = (color: string) => (
  <Icon viewBox="0 0 200 200" color={color}>
    <path
      fill="currentColor"
      d="M 100, 100 m -75, 0 a 75,75 0 1,0 150,0 a 75,75 0 1,0 -150,0"
    />
  </Icon>
);

const CtaButton = () => {
  return (
    <Link href={"/auth/signin"} passHref>
      <Button
        size="lg"
        colorScheme="blue"
        bgColor="blue.300"
        fontSize="xl"
        fontWeight="bold"
        color="white"
        _hover={{
          bg: "blue.600",
        }}
        shadow="md"
        mb=".5em"
      >
        {Copy.MainBanner.CtaButtonText}
      </Button>
    </Link>
  );
};

export function Banner() {
  return (
    <Flex flexDir="column" alignItems="center">
      <Box>
        <chakra.h1
          textAlign="center"
          fontSize="7xl"
          fontWeight="extrabold"
          color={useColorModeValue("gray.800", "gray.100")}
          lineHeight="shorter"
          mb=".3em"
        >
          {Copy.MainBanner.Header}
        </chakra.h1>

        <chakra.h2
          fontSize="3xl"
          fontWeight="bold"
          textAlign="center"
          lineHeight="shorter"
          w={["70%"]}
          mx="auto"
          color={useColorModeValue("gray.600", "gray.400")}
          mb=".8em"
        >
          {Copy.MainBanner.Subheader}
        </chakra.h2>
      </Box>

      {CtaButton()}

      <chakra.h3 color="gray.500" textAlign="center" mb="2em">
        {Copy.MainBanner.CtaButtonHelperText}
      </chakra.h3>

      <Box
        bg={useColorModeValue("gray.700", "gray.200")}
        borderRadius="xl"
        shadow={useColorModeValue(["lg"], ["lg"])}
        pt="5px"
        pb="10px"
        px="10px"
      >
        <Box>
          <HStack mb="5px" ml="5px">
            {CircleIcon("purple.400")} {CircleIcon("yellow.400")}{" "}
            {CircleIcon("red.400")}
          </HStack>
          <Image
            rounded="md"
            src={"/banner.png"}
            width="1100px"
            css={{
              imageRendering: "-webkit-optimize-contrast",
            }}
            alt="Komonitor App Dashboard"
          />
        </Box>
      </Box>
    </Flex>
  );
}
