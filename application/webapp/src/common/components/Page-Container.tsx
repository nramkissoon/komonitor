import { Container } from "@chakra-ui/react";
import React from "react";

export const PageContainer = (props: any) => {
  return (
    <Container
      maxW={["sm", "xl", "3xl", "5xl", "6xl", "7xl"]}
      overflow="hidden"
      mt="3em"
      mb="3em"
      pt=".3em"
    >
      {props.children}
    </Container>
  );
};
