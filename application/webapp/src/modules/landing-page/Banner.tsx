import {
  Box,
  Button,
  chakra,
  Flex,
  HStack,
  Icon,
  Image,
  SlideFade,
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
    <Flex mb="5em" flexDir="column" alignItems="center">
      <Box>
        <SlideFade in offsetY="40px" delay={0.2}>
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
        </SlideFade>
        <SlideFade in offsetY="40px" delay={0.3}>
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
        </SlideFade>
      </Box>
      <SlideFade in offsetY="40px" delay={0.5}>
        {CtaButton()}
      </SlideFade>
      <SlideFade in offsetY="40px" delay={0.5}>
        <chakra.h3 color="gray.500" textAlign="center" mb="2em">
          {Copy.MainBanner.CtaButtonHelperText}
        </chakra.h3>
      </SlideFade>
      <SlideFade in offsetY="40px" delay={0.5}>
        <Box
          bg={useColorModeValue("gray.700", "white")}
          borderRadius="2xl"
          shadow={useColorModeValue(["dark-lg"], ["dark-lg"])}
          px={["1em", null, "1.5em"]}
          pt="5px"
          pb={["1em", null, "1.5em"]}
        >
          <HStack mb="5px">
            {CircleIcon("purple.400")} {CircleIcon("yellow.400")}{" "}
            {CircleIcon("red.400")}
          </HStack>
          <Image
            borderRadius="lg"
            src={"/app-dashboard2.jpg"}
            width="1000px"
            css={{
              imageRendering: "-webkit-optimize-contrast",
            }}
            alt="Komonitor App Dashboard"
          />
        </Box>
      </SlideFade>
    </Flex>
  );
}
