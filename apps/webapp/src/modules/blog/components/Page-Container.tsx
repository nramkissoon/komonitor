import { ArrowBackIcon } from "@chakra-ui/icons";
import { Box, Button, chakra, Flex } from "@chakra-ui/react";
import Link from "next/link";
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
  lightOnly?: boolean;
}

function PageContainer(props: PageContainerProps) {
  const { frontmatter, children, lightOnly } = props;
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
      <Header lightModeOnly={lightOnly} />
      <Box
        as="main"
        w="full"
        mx="auto"
        mb="4em"
        className="main-content bg-blog-tile"
        bgRepeat="repeat"
        bgAttachment="fixed"
      >
        <Box display={{ md: "flex" }} maxW="4xl" mx="auto">
          <Box flex="1" minW="0">
            <Box id="content" px={2} mx="auto" minH="76vh">
              <Flex>
                <Box
                  minW="0"
                  flex="auto"
                  mt="10"
                  py="1.5em"
                  bg="gray.50"
                  shadow="sm"
                  rounded="xl"
                >
                  <Box>
                    <Link passHref href="/blog">
                      <Button
                        leftIcon={<ArrowBackIcon />}
                        colorScheme="gray"
                        variant="ghost"
                        _hover={{
                          color: "blue.600",
                        }}
                        fontWeight="normal"
                        as="a"
                      >
                        Back
                      </Button>
                    </Link>
                  </Box>
                  <chakra.div
                    w="full"
                    textAlign={"center"}
                    fontWeight="medium"
                    color="gray.500"
                  >
                    {lastEdited?.date}
                  </chakra.div>
                  <chakra.h1
                    tabIndex={-1}
                    outline={0}
                    apply="mdx.h1"
                    fontWeight="extrabold"
                    fontSize={["3xl", null, "5xl"]}
                    textAlign={"center"}
                    lineHeight="shorter"
                  >
                    {title}
                  </chakra.h1>
                  <chakra.p
                    w={["full", "80%"]}
                    textAlign={"center"}
                    fontWeight="medium"
                    color="gray.600"
                    m="auto"
                  >
                    {description}
                  </chakra.p>
                  <chakra.div
                    w={["full", "80%"]}
                    textAlign={"center"}
                    fontWeight="medium"
                    color="gray.600"
                    m="auto"
                    my="15px"
                  >
                    Written by {lastEdited?.author}
                  </chakra.div>
                  {children}
                </Box>
              </Flex>
            </Box>
          </Box>
        </Box>
      </Box>
      <Footer lightModeOnly={lightOnly} />
    </>
  );
}

export default PageContainer;
