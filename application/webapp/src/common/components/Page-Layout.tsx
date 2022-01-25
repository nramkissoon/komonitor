import { Box } from "@chakra-ui/react";
import { NextSeoProps } from "next-seo";
import React from "react";
import { AppFooter } from "./App-Footer";
import { AppHeader } from "./App-Header";
import { Footer } from "./Footer";
import { Header } from "./Header";
import { PageContainer } from "./Page-Container";
import Seo from "./Seo";

interface PageLayoutProps {
  isAppPage: boolean;
  seoProps: Pick<NextSeoProps, "title" | "description">;
  maxW?: string[];
}

export function PageLayout(props: PageLayoutProps & any) {
  const { isAppPage, seoProps, maxW } = props;
  const footer = isAppPage ? <AppFooter /> : <Footer />;
  const header = isAppPage ? <AppHeader /> : <Header />;

  return (
    <>
      <Seo {...seoProps} />
      <Box display="flex" flexDir="column" minH="95vh" p={0} m={0}>
        {header}
        <PageContainer isAppPage={isAppPage}>{props.children}</PageContainer>
        {footer}
      </Box>
    </>
  );
}
