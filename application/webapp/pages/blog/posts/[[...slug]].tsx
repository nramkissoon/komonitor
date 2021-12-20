import { InferGetStaticPropsType } from "next";
import { MDXRemote } from "next-mdx-remote";
import { MDXComponents } from "../../../src/common/components/Mdx-Components";
import MDXLayout from "../../../src/modules/blog/components/Mdx";
import loadMDXFromPages from "../../../src/modules/mdx-utils/load-mdx-dir";

const CONTENT_PATH = "blog/posts";

export default function Page({
  mdxSource,
  frontMatter,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  return (
    <MDXLayout frontmatter={frontMatter}>
      <MDXRemote {...mdxSource} components={MDXComponents} />
    </MDXLayout>
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
          .filter((item: any) => item !== "blog" && item !== "posts"), // remove the CONTENT_PATH since this isnt needed in static paths
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
