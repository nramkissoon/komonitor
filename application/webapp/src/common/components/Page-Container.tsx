import { Container } from "@chakra-ui/react";
import React from "react";

export const PageContainer = (props: any) => {
  return (
    <Container
      maxW={["sm", "xl", "2xl", "4xl", "5xl", "7xl"]}
      overflow="hidden"
      mt="3em"
    >
      {props.children}
    </Container>
  );
};
