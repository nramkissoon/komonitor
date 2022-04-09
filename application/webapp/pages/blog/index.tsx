import { ChakraProvider, extendTheme, theme } from "@chakra-ui/react";
import { mode } from "@chakra-ui/theme-tools";
import { InferGetStaticPropsType } from "next";
import { PageLayout } from "../../src/common/components/Page-Layout";
import { IndexPage } from "../../src/modules/blog/components/Index-Page";
import loadMDXFromPages from "../../src/modules/mdx-utils/load-mdx-dir";
const CONTENT_PATH = "blog/posts";

export default function Page({
  frontMatters,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  const blogTheme = extendTheme(
    {
      fonts: {
        heading: "Roboto",
        body: "Roboto",
      },
      styles: {
        global: (props: any) => ({
          body: {
            bg: mode("gray.50", "gray.50")(props),
            color: mode("black", "black")(props),
          },
        }),
      },
    },
    theme
  );
  return (
    <ChakraProvider theme={blogTheme}>
      <PageLayout
        seoProps={{
          title: "Blog",
          description:
            "Articles and guides on effective monitoring and alerting for any website. Learn about uptime monitoring, best alerting practices, and more.",
        }}
        full
        lightModeOnly
      >
        <IndexPage frontMatters={frontMatters as any} />
      </PageLayout>
    </ChakraProvider>
  );
}

export async function getStaticProps({ params }: any) {
  const pages = await loadMDXFromPages(CONTENT_PATH);

  const frontMatters = pages.map((page: any) => {
    // remove the mdxSource and just return the frontMatter we need
    const { mdxSource, ...frontMatter } = page as any;
    return frontMatter;
  });

  return {
    props: {
      frontMatters,
    },
  };
}
