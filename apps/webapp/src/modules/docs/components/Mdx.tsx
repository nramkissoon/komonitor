import * as React from "react";
import { getRouteContext } from "../../mdx-utils/get-route-context";
import { SidebarRoutes } from "../content";
import {
  findRouteByPath,
  removeFromLast,
} from "./../../mdx-utils/find-route-by-path";
import PageContainer from "./Page-Container";
import Pagination from "./Paginations";
import Sidebar, { RouteItem } from "./Sidebar";

interface MDXLayoutProps {
  frontmatter: any;
  children: React.ReactNode;
}

export default function MDXLayout(props: MDXLayoutProps) {
  const { frontmatter, children } = props;
  const routes = SidebarRoutes;

  const route = findRouteByPath(removeFromLast(frontmatter.slug, "#"), routes);
  const routeContext = getRouteContext(route as RouteItem, routes);

  return (
    <PageContainer
      frontmatter={frontmatter}
      sidebar={<Sidebar routes={routes} />}
      pagination={
        <Pagination
          next={routeContext.nextRoute}
          previous={routeContext.prevRoute}
        />
      }
    >
      {children}
    </PageContainer>
  );
}
