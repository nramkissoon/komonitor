import { Badge, Box, chakra, Flex, useColorModeValue } from "@chakra-ui/react";
import { useRouter } from "next/router";
import React from "react";
import { Footer } from "../../../common/components/Footer";
import { Header } from "../../../common/components/Header";
import Seo from "./Seo";

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
    readTimeMinutes?: number;
    lastEdited?: {
      date: string;
      author: string;
    };
  };
  children: React.ReactNode;
}

function PageContainer(props: PageContainerProps) {
  const { frontmatter, children } = props;
  useHeadingFocusOnRouteChange();

  const {
    title,
    description,
    editUrl,
    version,
    headings = [],
    lastEdited,
    readTimeMinutes,
  } = frontmatter;

  return (
    <>
      <Seo title={title} description={description} />
      <Header />
      <Box
        as="main"
        className="main-content"
        w="full"
        maxW="5xl"
        mx="auto"
        mb="4em"
      >
        <Box display={{ md: "flex" }}>
          <Box flex="1" minW="0">
            <Box id="content" px={5} mx="auto" minH="76vh">
              <Flex>
                <Box
                  minW="0"
                  flex="auto"
                  px={{ base: "4", sm: "8", xl: "10" }}
                  mt="10"
                  py="1.5em"
                  bg={useColorModeValue("white", "#0f131a")}
                  shadow="sm"
                  rounded="xl"
                >
                  <chakra.h1
                    tabIndex={-1}
                    outline={0}
                    apply="mdx.h1"
                    fontWeight="extrabold"
                    fontSize="5xl"
                  >
                    {title}
                  </chakra.h1>
                  <Badge
                    colorScheme="green"
                    fontSize="md"
                    borderRadius="sm"
                    variant="subtle"
                    fontWeight="medium"
                    p=".3em"
                    mb="1em"
                  >
                    {readTimeMinutes} minute read
                  </Badge>
                  {children}
                </Box>
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
