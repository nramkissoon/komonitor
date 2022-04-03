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
    <Flex
      justifyContent="center"
      flexDir="column"
      mb="4em"
      w="full"
      mt="3em"
      px="2"
    >
      <chakra.h1
        fontSize="xl"
        fontWeight="medium"
        textAlign="center"
        color={"blue.500"}
        letterSpacing="wide"
      >
        BLOG
      </chakra.h1>
      <chakra.span
        fontSize="3xl"
        fontWeight="bold"
        textAlign="center"
        m="auto"
        maxW={"2xl"}
        lineHeight="shorter"
      >
        Learn about monitoring, DevOps, and running an reliable online business.
      </chakra.span>
    </Flex>
  );

  if (!frontMatters || frontMatters.length === 0) {
    return (
      <Box flexGrow="1" className="bg-blog-tile" bgRepeat="repeat">
        {Header}
        <chakra.h1 fontSize="xl" fontWeight="bold" textAlign="center">
          Looks like there's nothing here yet....
        </chakra.h1>
      </Box>
    );
  }
  return (
    <Box flexGrow="1" className="bg-blog-tile" bgRepeat="repeat">
      {Header}
      <Flex alignItems="center" flexDir="column" px="2">
        {frontMatters
          .sort((a, b) =>
            new Date(a.lastEdited?.date ?? 0).getTime() <
            new Date(b.lastEdited?.date ?? 0).getTime()
              ? 1
              : -1
          )
          .map((frontMatter: FrontMatter) => (
            <BlogPostPanel key={frontMatter.slug} frontMatter={frontMatter} />
          ))}
      </Flex>
    </Box>
  );
}
