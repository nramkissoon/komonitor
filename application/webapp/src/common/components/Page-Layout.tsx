import { Box, Fade } from "@chakra-ui/react";
import React from "react";
import { AppFooter } from "./App-Footer";
import { AppHeader } from "./App-Header";
import { Footer } from "./Footer";
import { Header } from "./Header";
import { PageContainer } from "./Page-Container";

interface PageLayoutProps {
  isAppPage: boolean;
}

export function PageLayout(props: PageLayoutProps & any) {
  const { isAppPage } = props;
  const footer = isAppPage ? <AppFooter /> : <Footer />;
  const header = isAppPage ? <AppHeader /> : <Header />;

  return (
    <Box display="flex" flexDir="column" minH="95vh" p={0} m={0}>
      <Fade in={true}>{header}</Fade>
      <PageContainer>{props.children}</PageContainer>
      {footer}
    </Box>
  );
}
