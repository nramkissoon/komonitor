import {
  Box,
  Center,
  chakra,
  Divider,
  Flex,
  useColorModeValue,
} from "@chakra-ui/react";
import { Content } from "./content";

export function createSections() {
  return Content.map((section, i) => {
    const dividerNeeded = i !== Content.length - 1;
    return (
      <Box key={section.Header} w={["xs", "sm", "lg"]}>
        <chakra.h2
          fontSize="5xl"
          fontWeight="bold"
          id={section.Header}
          className="content"
          textAlign="center"
        >
          {section.Header}
        </chakra.h2>
        <Flex flexDir="column" justifyItems="center">
          {section.Features.map((feature) => {
            return (
              <Flex
                key={feature.feature}
                fontSize="2xl"
                fontWeight="bold"
                mt=".7em"
                w="90%"
                mx="auto"
              >
                <chakra.span mr={feature.completed ? ".5em" : "1.5em"}>
                  {feature.completed ? "✅ " : "-"}
                </chakra.span>
                <chakra.span>{feature.feature}</chakra.span>
              </Flex>
            );
          })}
        </Flex>
        {dividerNeeded ? (
          <Center h="8em" my="1em">
            <Divider
              orientation="vertical"
              borderColor={useColorModeValue("gray.400", "gray.600")}
              borderWidth="2px"
            />
          </Center>
        ) : null}
      </Box>
    );
  });
}

export function RoadmapPageContent() {
  return (
    <Flex
      bg={useColorModeValue("white", "#0f131a")}
      shadow="xl"
      borderRadius="30px"
      px="1em"
      overflowX="auto"
    >
      <Flex mb="5em" flexDir="column" alignItems="center" flex="1">
        <Box>
          <chakra.h1
            textAlign="center"
            fontSize="6xl"
            fontWeight="extrabold"
            color={useColorModeValue("gray.800", "gray.100")}
            lineHeight="shorter"
            mb=".5em"
            mt="1em"
          >
            Product Roadmap
          </chakra.h1>
        </Box>
        {createSections()}
      </Flex>
      {/* <Box mt="2em" display={["none", null, null, "inherit"]}>
        <TableOfContents />
      </Box> */}
    </Flex>
  );
}
