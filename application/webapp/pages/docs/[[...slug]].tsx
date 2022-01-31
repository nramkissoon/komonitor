//https://github.com/chakra-ui/chakra-ui/blob/main/website/pages/docs/%5B%5B...slug%5D%5D.tsx

import { ChakraProvider, extendTheme } from "@chakra-ui/react";
import { mode } from "@chakra-ui/theme-tools";
import { InferGetStaticPropsType } from "next";
import { MDXRemote } from "next-mdx-remote";
import { MDXComponents } from "../../src/common/components/Mdx-Components";
import theme from "../../src/common/components/theme";
import MDXLayout from "../../src/modules/docs/components/Mdx";
import loadMDXFromPages from "../../src/modules/mdx-utils/load-mdx-dir";

const CONTENT_PATH = "docs";

export default function Page({
  mdxSource,
  frontMatter,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  const docsTheme = extendTheme(
    {
      styles: {
        global: (props: any) => ({
          body: {
            bg: mode("white", "gray.900")(props),
          },
        }),
      },
    },
    theme
  );
  return (
    <ChakraProvider theme={docsTheme}>
      <MDXLayout frontmatter={frontMatter}>
        <MDXRemote {...mdxSource} components={MDXComponents} />
      </MDXLayout>
    </ChakraProvider>
  );
}

export async function getStaticPaths() {
  const pages = await loadMDXFromPages(CONTENT_PATH);
  const paths = pages.map(({ slug }: any) => {
    return {
      params: {
        slug: slug
          .slice(1) // remove the first `/`
          .split("/") // split to get an array
          .filter((item: any) => item !== CONTENT_PATH), // remove the CONTENT_PATH since this isnt needed in static paths
      },
    };
  });

  return {
    paths,
    fallback: false,
  };
}

export async function getStaticProps({ params }: any) {
  const slug = params.slug;
  const combinedPageSlug = `/${[CONTENT_PATH, ...slug].join("/")}`;
  const pages = await loadMDXFromPages(CONTENT_PATH);

  const page = pages.find((page: any) => {
    return combinedPageSlug === page.slug;
  });

  if (!page) {
    throw new Error(`No content found for slug "${slug.join("/")}"`);
  }

  const { mdxSource, ...frontMatter } = page as any;

  return {
    props: {
      mdxSource,
      frontMatter,
    },
  };
}
