import { Box, chakra, Divider, Flex } from "@chakra-ui/react";
import { useRouter } from "next/router";
import React from "react";
import { Footer } from "../../../common/components/Footer";
import { Header } from "../../../common/components/Header";
import TableOfContents from "./Table-Of-Contents";

function useHeadingFocusOnRouteChange() {
  const router = useRouter();

  React.useEffect(() => {
    const onRouteChange = () => {
      const [heading] = Array.from(document.getElementsByTagName("h1"));
      heading?.focus();
    };
    router.events.on("routeChangeComplete", onRouteChange);
    return () => {
      router.events.off("routeChangeComplete", onRouteChange);
    };
  }, [router.events]);
}

export interface Heading {
  level: "h2" | "h3";
  text: string;
  id: string;
}

interface PageContainerProps {
  frontmatter: {
    slug?: string;
    title: string;
    description?: string;
    editUrl?: string;
    version?: string;
    headings?: Heading[];
  };
  children: React.ReactNode;
  sidebar?: any;
  pagination?: any;
}

function PageContainer(props: PageContainerProps) {
  const { frontmatter, children, sidebar, pagination } = props;
  useHeadingFocusOnRouteChange();

  const { title, description, editUrl, version, headings = [] } = frontmatter;

  return (
    <>
      <Header />
      <Box
        as="main"
        className="main-content"
        w="full"
        maxW="8xl"
        mx="auto"
        mb="4em"
      >
        <Box display={{ md: "flex" }}>
          {sidebar || null}
          <Box flex="1" minW="0">
            <Box id="content" px={5} mx="auto" minH="76vh">
              <Flex>
                <Box
                  minW="0"
                  flex="auto"
                  px={{ base: "4", sm: "6", xl: "8" }}
                  pt="10"
                >
                  <chakra.h1
                    tabIndex={-1}
                    outline={0}
                    apply="mdx.h1"
                    fontWeight="extrabold"
                    fontSize="6xl"
                    mb=".5em"
                  >
                    {title}
                  </chakra.h1>
                  {children}
                  <Divider mt="2em" />
                  <Box mt="20px">{pagination || null}</Box>
                </Box>
                <TableOfContents headings={headings} />
              </Flex>
            </Box>
          </Box>
        </Box>
      </Box>
      <Footer />
    </>
  );
}

export default PageContainer;
