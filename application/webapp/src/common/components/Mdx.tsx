import * as chakraComponents from "@chakra-ui/react";
import { MDXProvider } from "@mdx-js/react";
import * as React from "react";
import { MDXComponents } from "./Mdx-Components";
import { PageLayout } from "./Page-Layout";

export function MDXLayoutProvider({ children }: any) {
  return (
    <MDXProvider components={{ ...chakraComponents, ...MDXComponents } as any}>
      {children}
    </MDXProvider>
  );
}

interface MDXLayoutProps {
  isAppPage: boolean;
  frontmatter: any;
  children: React.ReactNode;
  maxW?: string[];
}

export default function MDXLayout(props: MDXLayoutProps) {
  const { frontmatter, children, isAppPage, maxW } = props;

  return (
    <MDXLayoutProvider>
      <PageLayout isAppPage={isAppPage} seoProps={frontmatter} maxW={maxW}>
        {children}
      </PageLayout>
    </MDXLayoutProvider>
  );
}
