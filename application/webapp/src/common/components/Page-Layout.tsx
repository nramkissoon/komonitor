import { Box } from "@chakra-ui/react";
import { NextSeoProps } from "next-seo";
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
  full?: boolean;
  lightModeOnly?: boolean;
}

export function PageLayout(props: PageLayoutProps & any) {
  const { isAppPage, seoProps, full, lightModeOnly } = props;
  const footer = isAppPage ? (
    <AppFooter />
  ) : (
    <Footer lightModeOnly={lightModeOnly} />
  );
  const header = isAppPage ? (
    <AppHeader />
  ) : (
    <Header lightModeOnly={lightModeOnly} />
  );

  return (
    <>
      <Seo {...seoProps} />
      <Box display="flex" flexDir="column" minH="99vh" p={0} m={0}>
        {header}
        {!full && (
          <PageContainer isAppPage={isAppPage}>{props.children}</PageContainer>
        )}
        {full && <>{props.children}</>}
        {footer}
      </Box>
    </>
  );
}
