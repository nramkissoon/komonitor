import { InferGetStaticPropsType } from "next";
import { MDXRemote } from "next-mdx-remote";
import MDXLayout from "../src/common/components/Mdx";
import { MDXComponents } from "../src/common/components/Mdx-Components";
import loadMDXFromPages from "../src/modules/mdx-utils/load-mdx-dir";

const CONTENT_PATH = "legal";

export default function Page({
  mdxSource,
  frontMatter,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  return (
    <MDXLayout
      isAppPage={false}
      frontmatter={frontMatter}
      maxW={["sm", "xl", "3xl", "4xl", "4xl", "4xl"]}
    >
      <MDXRemote {...mdxSource} components={MDXComponents} />
    </MDXLayout>
  );
}

export async function getStaticProps({ params }: any) {
  const combinedPageSlug = `/legal/terms`;
  const pages = await loadMDXFromPages(CONTENT_PATH);

  const page = pages.find((page: any) => {
    return combinedPageSlug === page.slug;
  });

  if (!page) {
    throw new Error(`No content found for TOS`);
  }

  const { mdxSource, ...frontMatter } = page as any;

  return {
    props: {
      mdxSource,
      frontMatter,
    },
  };
}
