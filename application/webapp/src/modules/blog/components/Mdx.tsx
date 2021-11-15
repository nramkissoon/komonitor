import * as chakraComponents from "@chakra-ui/react";
import { MDXProvider } from "@mdx-js/react";
import * as React from "react";
import { MDXComponents } from "../../../common/components/Mdx-Components";
import PageContainer from "./Page-Container";

export function MDXLayoutProvider({ children }: any) {
  return (
    <MDXProvider components={{ ...chakraComponents, ...MDXComponents } as any}>
      {children}
    </MDXProvider>
  );
}

interface MDXLayoutProps {
  frontmatter: any;
  children: React.ReactNode;
}

export default function MDXLayout(props: MDXLayoutProps) {
  const { frontmatter, children } = props;

  return (
    <MDXLayoutProvider>
      <PageContainer frontmatter={frontmatter}>{children}</PageContainer>
    </MDXLayoutProvider>
  );
}
