import { Container } from "@chakra-ui/react";

export const PageContainer = (props: { isAppPage?: boolean } & any) => {
  const { isAppPage } = props;
  return (
    <Container
      maxW={
        isAppPage
          ? ["sm", "xl", "3xl", "5xl", "6xl", "7xl"]
          : ["sm", "xl", "3xl", "5xl", "6xl", "8xl"]
      }
      mt="3em"
      mb="3em"
      pt=".3em"
      px="0"
    >
      {props.children}
    </Container>
  );
};
