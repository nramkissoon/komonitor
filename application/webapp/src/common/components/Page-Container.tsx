import { Container } from "@chakra-ui/react";
import React from "react";

export const PageContainer = (props: { maxW?: string[] } & any) => {
  const { maxW } = props;
  return (
    <Container
      maxW={maxW ? maxW : ["sm", "xl", "3xl", "5xl", "6xl", "8xl"]}
      mt="3em"
      mb="3em"
      pt=".3em"
    >
      {props.children}
    </Container>
  );
};
