import {
  Badge,
  Button,
  chakra,
  Flex,
  useColorModeValue,
} from "@chakra-ui/react";
import NextLink from "next/link";
import { FrontMatter } from "../utils";

function BlogPostPanel(props: { frontMatter: FrontMatter }) {
  const { frontMatter } = props;
  return (
    <Flex
      bg={useColorModeValue("white", "gray.950")}
      borderRadius="lg"
      shadow="lg"
      flexDir="column"
      p="1.5em"
      maxWidth={["3xl"]}
      mb="2em"
    >
      <chakra.h2 fontSize="3xl" fontWeight="bold">
        {frontMatter.title}
      </chakra.h2>
      <chakra.h3 fontSize="ls" fontWeight="bold">
        {frontMatter.lastEdited?.date}
      </chakra.h3>
      <Badge colorScheme="green" w="fit-content" mt="3px" mb="1.5em">
        {frontMatter.readTimeMinutes} minute read
      </Badge>
      <chakra.p mb="1em" fontSize="lg">
        {frontMatter.description}
      </chakra.p>
      <NextLink href={frontMatter.slug as string} passHref>
        <Button size="md" maxW="8em" _hover={{ bg: "gray.300" }} shadow="sm">
          Read More
        </Button>
      </NextLink>
    </Flex>
  );
}

export function IndexPage(props: { frontMatters: FrontMatter[] }) {
  const { frontMatters } = props;

  const Header = (
    <Flex justifyContent="center" flexDir="column" mb="4em">
      <chakra.h1 fontSize="5xl" fontWeight="extrabold" textAlign="center">
        Komonitor Blog
      </chakra.h1>
      <chakra.h2
        fontSize="xl"
        fontWeight="bold"
        textAlign="center"
        color={useColorModeValue("gray.600", "gray.500")}
      >
        Articles, guides, and knowledge on effective monitoring and alerting
        systems.
      </chakra.h2>
    </Flex>
  );

  if (!frontMatters || frontMatters.length === 0) {
    return (
      <>
        {Header}
        <chakra.h1 fontSize="xl" fontWeight="bold" textAlign="center">
          Looks like there's nothing here yet....
        </chakra.h1>
      </>
    );
  }
  return (
    <>
      {Header}
      <Flex alignItems="center" flexDir="column">
        {frontMatters.map((frontMatter: FrontMatter) => (
          <BlogPostPanel key={frontMatter.slug} frontMatter={frontMatter} />
        ))}
      </Flex>
    </>
  );
}
