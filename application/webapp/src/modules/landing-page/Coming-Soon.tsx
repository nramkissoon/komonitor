import {
  ButtonProps,
  chakra,
  Flex,
  Icon,
  SimpleGrid,
  useColorModeValue,
} from "@chakra-ui/react";
import Link from "next/link";
import { AiOutlineAlert, AiOutlineApi } from "react-icons/ai";
import { IoLogoGoogle } from "react-icons/io";
import { Copy } from "./constants";

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
    >
      <Flex
        alignItems={["center"]}
        justifyContent={["center"]}
        w="3.5em"
        rounded="full"
        h="3.5em"
        mb={4}
        color={useColorModeValue(`${color}.600`, `${color}.100`)}
        bg={useColorModeValue(`${color}.100`, `${color}.600`)}
      >
        {icon}
      </Flex>
      <chakra.h2
        mb={2}
        fontWeight="semibold"
        lineHeight="shorter"
        fontSize="xl"
      >
        {title}
      </chakra.h2>
      <chakra.p fontSize="md" color={useColorModeValue("gray.500", "gray.400")}>
        {desc}
      </chakra.p>
    </Flex>
  );
}

const RoadmapLink = () => {
  const defaultButtonLinkStyles: ButtonProps = {
    color: useColorModeValue("blue.500", "blue.400"),
    alignItems: "center",
    variant: "ghost",
    _focus: { boxShadow: "none" },
    _hover: { color: useColorModeValue("gray.500", "white") },
    as: "a",
  };

  return (
    <Link href={"/roadmap"} passHref>
      <chakra.span {...defaultButtonLinkStyles}>roadmap</chakra.span>
    </Link>
  );
};

export function ComingSoon() {
  const features = Copy.ComingSoon.List;
  return (
    <Flex mb="4em" flexDir="column" alignItems="center" as="section">
      <chakra.h2
        textAlign="center"
        fontSize="5xl"
        fontWeight="extrabold"
        color={useColorModeValue("gray.800", "gray.100")}
        lineHeight="shorter"
        mb="1.3em"
      >
        New Features Coming Soon{" "}
        <chakra.span fontWeight="normal">🚀</chakra.span>
      </chakra.h2>
      <SimpleGrid
        columns={{ base: 1, sm: 2, md: 2, lg: 3 }}
        spacingX={{ base: 16, lg: 24 }}
        spacingY={20}
        mb="3em"
      >
        <Feature
          {...features.lighthouse}
          color="orange"
          icon={
            <Icon
              boxSize={10}
              as={IoLogoGoogle}
              fill="currentColor"
              aria-hidden={true}
            />
          }
        />
        <Feature
          {...features.api}
          color="cyan"
          icon={
            <Icon
              boxSize={10}
              as={AiOutlineApi}
              fill="currentColor"
              aria-hidden={true}
            />
          }
        />
        <Feature
          {...features.alert}
          color="red"
          icon={
            <Icon
              boxSize={10}
              as={AiOutlineAlert}
              fill="currentColor"
              aria-hidden={true}
            />
          }
        />
      </SimpleGrid>
    </Flex>
  );
}
