import { Badge, Box, chakra, Flex } from "@chakra-ui/react";
import NextLink from "next/link";
import { FrontMatter } from "../utils";

function BlogPostPanel(props: { frontMatter: FrontMatter }) {
  const { frontMatter } = props;
  return (
    <Flex
      bg={"white"}
      borderRadius="lg"
      shadow="lg"
      flexDir="column"
      p="1.5em"
      maxWidth={["3xl"]}
      mb="2em"
      role={"group"}
      transitionDuration="0.2s"
      _hover={{
        cursor: "pointer",
        transform: "scale(1.03)",
      }}
    >
      <NextLink href={frontMatter.slug as string} passHref>
        <Box>
          <chakra.h2 fontSize="3xl" fontWeight="bold">
            {frontMatter.title}
          </chakra.h2>
          <chakra.h3 fontSize="ls" fontWeight="bold">
            {frontMatter.lastEdited?.date}
          </chakra.h3>
          <Badge
            w="fit-content"
            mt="3px"
            mb="1em"
            bg="green.100"
            color="green.700"
          >
            {frontMatter.readTimeMinutes} minute read
          </Badge>
          <chakra.p mb=".8em" fontSize="lg">
            {frontMatter.description}
          </chakra.p>
          <chakra.p
            fontSize="lg"
            fontWeight="medium"
            color="blue.500"
            opacity={0}
            transitionDuration="0.2s"
            _groupHover={{ opacity: 1 }}
          >
            Read more
          </chakra.p>
        </Box>
      </NextLink>
    </Flex>
  );
}

export function IndexPage(props: { frontMatters: FrontMatter[] }) {
  const { frontMatters } = props;

  const Header = (
    <Flex justifyContent="center" flexDir="column" mb="4em" w="full" mt="3em">
      <chakra.h1 fontSize="5xl" fontWeight="extrabold" textAlign="center">
        Blog
      </chakra.h1>
      <chakra.h2
        fontSize="xl"
        fontWeight="bold"
        textAlign="center"
        color={"gray.600"}
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
