import { InferGetStaticPropsType } from "next";
import { PageLayout } from "../../src/common/components/Page-Layout";
import { IndexPage } from "../../src/modules/blog/components/Index-Page";
import loadMDXFromPages from "../../src/modules/mdx-utils/load-mdx-dir";

const CONTENT_PATH = "blog/posts";

export default function Page({
  frontMatters,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  console.log(frontMatters);
  return (
    <PageLayout
      seoProps={{
        title: "Blog",
        description:
          "Komonitor Blog. Articles and guides on effective monitoring and alerting for any website.",
      }}
    >
      <IndexPage frontMatters={frontMatters as any} />
    </PageLayout>
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
