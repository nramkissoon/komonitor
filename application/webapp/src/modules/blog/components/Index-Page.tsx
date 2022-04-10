import { SearchIcon } from "@chakra-ui/icons";
import {
  Badge,
  Box,
  chakra,
  Flex,
  Input,
  InputGroup,
  InputLeftElement,
  useColorModeValue,
} from "@chakra-ui/react";
import Fuse from "fuse.js";
import { uniqueId } from "lodash";
import NextLink from "next/link";
import React from "react";
import { FrontMatter } from "../utils";

const getTagColor = (tag: string) => {
  switch (tag) {
    case "aws":
      return { bg: "#FF9900", color: "white" };
    case "monitoring":
      return { bg: "blue.400", color: "white" };
    case "saas":
      return { bg: "purple.400", color: "white" };
    case "tutorial":
      return { bg: "gray.400", color: "white" };
    case "metrics":
      return { bg: "green.400", color: "white" };
    default:
      return { bg: "gray.500", color: "white" };
  }
};

const Tag: React.FC<{ tag: string }> = ({ tag }) => {
  const colors = getTagColor(tag);
  return (
    <Badge color={colors.color} bg={colors.bg} px="6px">
      {tag}
    </Badge>
  );
};

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
          {frontMatter.tags && frontMatter.tags?.length > 0 && (
            <Flex gap={2}>
              {frontMatter.tags.map((t) => (
                <Tag key={uniqueId()} tag={t} />
              ))}
            </Flex>
          )}
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
          <NextLink href={frontMatter.slug as string} passHref>
            <chakra.a
              fontSize="lg"
              fontWeight="medium"
              color="blue.500"
              opacity={0}
              transitionDuration="0.2s"
              _groupHover={{ opacity: 1 }}
            >
              Read more
            </chakra.a>
          </NextLink>
        </Box>
      </NextLink>
    </Flex>
  );
}

export function IndexPage(props: { frontMatters: FrontMatter[] }) {
  const { frontMatters } = props;

  const [searchQuery, setSearchQuery] = React.useState("");
  const fuse = new Fuse(frontMatters, {
    keys: ["title", "tags", "description"],
  });
  const results = fuse.search(searchQuery);

  const Header = (
    <Flex
      justifyContent="center"
      flexDir="column"
      mb="2em"
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
        Learn about monitoring, DevOps, and running online businesses.
      </chakra.span>
    </Flex>
  );

  return (
    <Box flexGrow="1" className="bg-blog-tile" bgRepeat="repeat">
      {Header}
      <InputGroup
        mr="1em"
        mb="30px"
        w="2xl"
        mx="auto"
        border="1px"
        borderColor="gray.300"
        borderRadius="lg"
        shadow="sm"
      >
        <InputLeftElement
          pointerEvents="none"
          children={<SearchIcon color="gray.300" />}
        />
        <Input
          shadow="sm"
          placeholder="Search posts..."
          background={useColorModeValue("white", "gray.950")}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </InputGroup>
      <Flex alignItems="center" flexDir="column" px={5}>
        {searchQuery === ""
          ? frontMatters
              .sort((a: any, b: any) =>
                new Date(a.lastEdited?.date ?? 0).getTime() <
                new Date(b.lastEdited?.date ?? 0).getTime()
                  ? 1
                  : -1
              )
              .slice(0, 5)
              .map((frontMatter: FrontMatter) => (
                <BlogPostPanel
                  key={frontMatter.slug}
                  frontMatter={frontMatter}
                />
              ))
          : results.map((r) => (
              <BlogPostPanel key={r.item.slug} frontMatter={r.item} />
            ))}
      </Flex>
    </Box>
  );
}
