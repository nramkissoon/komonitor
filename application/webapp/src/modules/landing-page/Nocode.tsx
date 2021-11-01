import {
  Box,
  chakra,
  Flex,
  HStack,
  Icon,
  Img,
  useColorModeValue,
} from "@chakra-ui/react";
import { Copy } from "./constants";

const CircleIcon = (color: string) => (
  <Icon viewBox="0 0 200 200" color={color}>
    <path
      fill="currentColor"
      d="M 100, 100 m -75, 0 a 75,75 0 1,0 150,0 a 75,75 0 1,0 -150,0"
    />
  </Icon>
);

export function NoCode() {
  return (
    <Flex mb="4em" flexDir="column" alignItems="center">
      <chakra.h1
        textAlign="center"
        fontSize="5xl"
        fontWeight="extrabold"
        color={useColorModeValue("gray.800", "gray.100")}
        lineHeight="shorter"
        mb="10px"
      >
        {Copy.NoCode.Header}
      </chakra.h1>
      <chakra.h2
        fontSize="2xl"
        fontWeight="bold"
        textAlign="center"
        lineHeight="shorter"
        w={["70%"]}
        mx="auto"
        color={useColorModeValue("gray.600", "gray.400")}
        mb="2em"
      >
        {Copy.NoCode.Subheader}
      </chakra.h2>

      <chakra.h2
        fontSize="4xl"
        fontWeight="bold"
        textAlign="center"
        lineHeight="shorter"
        mx="auto"
        color={useColorModeValue("gray.800", "gray.100")}
        mb=".8em"
      >
        {Copy.NoCode.UI}
      </chakra.h2>

      <chakra.h2
        fontSize="4xl"
        fontWeight="bold"
        textAlign="center"
        lineHeight="shorter"
        mx="auto"
        color={useColorModeValue("gray.800", "gray.100")}
        mb=".8em"
      >
        {Copy.NoCode.Dashboard}
      </chakra.h2>
      <Box
        bg={useColorModeValue("gray.700", "gray.600")}
        borderRadius="2xl"
        shadow={useColorModeValue(["dark-lg"], ["dark-lg"])}
        px={["1em", null, "1.5em"]}
        pt="5px"
        pb={["1em", null, "1.5em"]}
        mb="2em"
      >
        <HStack mb="5px">
          {CircleIcon("green.400")} {CircleIcon("gray.300")}{" "}
          {CircleIcon("cyan.400")}
        </HStack>
        <Img
          borderRadius="lg"
          src={"/dashboard-ui_2.gif"}
          width="960px"
          css={{
            imageRendering: "-webkit-optimize-contrast",
          }}
          fallback="no-code-dashboard-1.jpg"
        />
      </Box>

      <chakra.h3
        fontSize="2xl"
        fontWeight="bold"
        textAlign="center"
        lineHeight="shorter"
        mx="auto"
        color={useColorModeValue("gray.800", "gray.100")}
        mb=".8em"
      >
        {Copy.NoCode.SectionBottom}
      </chakra.h3>
    </Flex>
  );
}
