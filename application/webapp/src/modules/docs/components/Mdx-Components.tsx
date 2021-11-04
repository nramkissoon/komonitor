import * as Chakra from "@chakra-ui/react";
import { chakra } from "@chakra-ui/react";

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
      {...props}
    />
  ),
  h3: (props: any) => (
    <chakra.h3 apply="mdx.h3" fontWeight="bold" fontSize="3xl" {...props} />
  ),
};
