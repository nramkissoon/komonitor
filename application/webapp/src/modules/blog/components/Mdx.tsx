import * as React from "react";
import PageContainer from "./Page-Container";

interface MDXLayoutProps {
  frontmatter: any;
  children: React.ReactNode;
}

export default function MDXLayout(props: MDXLayoutProps) {
  const { frontmatter, children } = props;

  return (
    <PageContainer frontmatter={frontmatter} lightOnly>
      {children}
    </PageContainer>
  );
}
