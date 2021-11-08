import * as Chakra from "@chakra-ui/react";
import { Alert, chakra } from "@chakra-ui/react";

export const MDXComponents = {
  ...Chakra,
  h1: (props: any) => (
    <chakra.h1
      apply="mdx.h1"
      fontWeight="extrabold"
      fontSize="6xl"
      {...props}
    />
  ),
  h2: (props: any) => (
    <chakra.h2
      apply="mdx.h2"
      fontWeight="extrabold"
      fontSize="4xl"
      mb=".4em"
      mt=".7em"
      {...props}
    />
  ),
  h3: (props: any) => (
    <chakra.h3 apply="mdx.h3" fontWeight="bold" fontSize="3xl" {...props} />
  ),
  p: (props: any) => <chakra.p fontSize="xl" mt="1em" {...props} />,
  blockquote: (props: any) => (
    <Alert
      mt="4"
      role="none"
      colorScheme="red"
      variant="left-accent"
      as="blockquote"
      rounded="4px"
      my="1.5rem"
      shadow="md"
      {...props}
    />
  ),
};
