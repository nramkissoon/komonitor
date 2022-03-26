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
import React, { useEffect } from "react";
import SVG from "../../../public/banner.svg";
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
  const headerPossibilities = [
    "Developers",
    "Indie-Hackers",
    "Website Owners",
    "E-Commerce",
    "Startups",
    "Teams",
    "Portfolios",
    "Everyone",
    "APIs",
  ];
  const [index, setIndex] = React.useState(0);

  useEffect(() => {
    let id = setInterval(() => {
      setIndex(index === headerPossibilities.length - 1 ? 0 : index + 1);
    }, 4000);
    return () => clearInterval(id);
  });

  return (
    <Flex
      flexDir={["column", null, null, null, null, "row"]}
      alignItems="center"
      as="section"
      mt="3em"
      justifyContent="center"
    >
      <Flex
        flexDir="column"
        alignItems="center"
        justifyContent="center"
        flexBasis={"50%"}
        px="20px"
        mb="30px"
      >
        {/* <SlideFade in={true} offsetX="-100px" delay={0.1}> */}
        <chakra.h1
          textAlign="center"
          fontSize={["4xl", null, "5xl", null, "6xl", "7xl"]}
          fontWeight="extrabold"
          color={useColorModeValue("gray.800", "gray.100")}
          lineHeight="shorter"
          mb=".3em"
        >
          Website Monitoring for{" "}
          <span className="underline decoration-black decoration-3 decoration-solid decoration-blue-400">
            {headerPossibilities[index]}
          </span>
        </chakra.h1>
        {/* </SlideFade> */}

        {/* <SlideFade in={true} offsetX="-100px" delay={0.1}> */}
        <chakra.h2
          fontSize={["2xl", null, "3xl", null, "3xl", "4xl"]}
          fontWeight="bold"
          textAlign="center"
          lineHeight="shorter"
          w={["70%"]}
          mx="auto"
          color={useColorModeValue("gray.600", "gray.400")}
          mb=".8em"
        >
          Monitoring and alerting for when user experience is nonnegotiable. Set
          up and deploy in minutes.
        </chakra.h2>
        {/* </SlideFade>
        <ScaleFade initialScale={0.8} in={true} delay={0.3}>*/}
        <CtaButton />
        {/* </ScaleFade> */}
      </Flex>

      <Box
        position="relative"
        overflow="hidden"
        w={["100%", null, null, null, null, "1500px"]}
        roundedLeft={["none", null, null, null, null, "2xl"]}
        flexGrow={1}
      >
        <Box
          position="absolute"
          top="0"
          left="0"
          w={["100%", null, null, null, null, "1600px"]}
        >
          <SVG />
        </Box>

        {/* <SlideFade in={true} offsetY="100px" delay={0.3}> */}
        <Flex
          justifyContent="center"
          position="relative"
          py={["0", null, null, null, null, "60px"]}
          pl={["0", null, null, null, null, "40px"]}
          pr={["0", null, null, null, null, "5vw"]}
        >
          <Box
            bg={useColorModeValue("gray.700", "gray.200")}
            borderRadius="xl"
            shadow={"lg"}
            pt="5px"
            pb="10px"
            px="10px"
            w={["3xl", null, "4xl", null, "5xl", "inherit"]}
            mt={["40px", null, null, null, null, "inherit"]}
            mx="2em"
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
        {/* </SlideFade> */}
      </Box>
    </Flex>
  );
}
