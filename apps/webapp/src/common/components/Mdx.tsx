import * as React from "react";
import { PageLayout } from "./Page-Layout";

interface MDXLayoutProps {
  isAppPage: boolean;
  frontmatter: any;
  children: React.ReactNode;
  maxW?: string[];
}

export default function MDXLayout(props: MDXLayoutProps) {
  const { frontmatter, children, isAppPage, maxW } = props;

  return (
    <PageLayout isAppPage={isAppPage} seoProps={frontmatter} maxW={maxW}>
      {children}
    </PageLayout>
  );
}
