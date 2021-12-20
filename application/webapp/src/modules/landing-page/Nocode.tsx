import {
  Box,
  chakra,
  Flex,
  HStack,
  Icon,
  SimpleGrid,
  useColorModeValue,
} from "@chakra-ui/react";
import { AiOutlineTable } from "react-icons/ai";
import { BiBrain, BiBuildings } from "react-icons/bi";
import { GoBrowser } from "react-icons/go";
import { Copy } from "./constants";

const CircleIcon = (color: string) => (
  <Icon viewBox="0 0 200 200" color={color}>
    <path
      fill="currentColor"
      d="M 100, 100 m -75, 0 a 75,75 0 1,0 150,0 a 75,75 0 1,0 -150,0"
    />
  </Icon>
);

interface FeatureProps {
  title: string;
  desc: string;
  color: string;
  icon: React.ReactElement;
}

function Feature(props: FeatureProps) {
  const { title, desc, icon, color } = props;

  return (
    <Flex
      flexDir="column"
      alignItems={["center", "start"]}
      justifyContent={["center", "start"]}
      bg={useColorModeValue("white", "#0f131a")}
      p="2em"
      shadow="lg"
      borderRadius="xl"
    >
      <Flex
        alignItems={["center"]}
        justifyContent={["center"]}
        w="5em"
        rounded="full"
        h="5em"
        mb={4}
        color={useColorModeValue(`${color}.600`, `${color}.100`)}
        bg={useColorModeValue(`${color}.100`, `${color}.600`)}
      >
        {icon}
      </Flex>
      <chakra.h3
        mb={2}
        fontWeight="semibold"
        lineHeight="shorter"
        fontSize="3xl"
      >
        {title}
      </chakra.h3>
      <chakra.p fontSize="xl" color={useColorModeValue("gray.500", "gray.400")}>
        {desc}
      </chakra.p>
    </Flex>
  );
}

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

      <SimpleGrid
        columns={{ base: 1, sm: 1, md: 2 }}
        spacingX={{ base: 16, lg: 24 }}
        spacingY={{ base: 10, md: 20 }}
        mb="4em"
      >
        <Feature
          title={Copy.NoCode.Intuitive.header}
          desc={Copy.NoCode.Intuitive.subheader}
          color={"blue"}
          icon={
            <Icon
              boxSize={12}
              as={GoBrowser}
              fill="currentColor"
              aria-hidden={true}
            />
          }
        />
        <Feature
          title={Copy.NoCode.Infra.header}
          desc={Copy.NoCode.Infra.subheader}
          color={"red"}
          icon={
            <Icon
              boxSize={12}
              as={BiBuildings}
              fill="currentColor"
              aria-hidden={true}
            />
          }
        />
        <Feature
          title={Copy.NoCode.Data.header}
          desc={Copy.NoCode.Data.subheader}
          color={"green"}
          icon={
            <Icon
              boxSize={12}
              as={AiOutlineTable}
              fill="currentColor"
              aria-hidden={true}
            />
          }
        />
        <Feature
          title={Copy.NoCode.Learn.header}
          desc={Copy.NoCode.Learn.subheader}
          color={"yellow"}
          icon={
            <Icon
              boxSize={12}
              as={BiBrain}
              fill="currentColor"
              aria-hidden={true}
            />
          }
        />
      </SimpleGrid>

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
        <video width="960px" height="640" loop autoPlay controls>
          <source src="/dashboard-ui.mp4" type="video/mp4"></source>
        </video>
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
