import { Box, chakra, Stack, useColorModeValue } from "@chakra-ui/react";
import sortBy from "lodash/sortBy";
import { useRouter } from "next/router";
import * as React from "react";
import SidebarCategory from "./Sidebar-Category";
import SidebarLink from "./Sidebar-Link";

// https://github.com/chakra-ui/chakra-ui/blob/6b0eaa05ff181875fb3629b82865407e6a70beb5/website/src/utils/get-route-context.ts#L11
export interface RouteItem {
  title: string;
  path?: string;
  open?: boolean;
  heading?: boolean;
  sort?: boolean;
  routes?: RouteItem[];
  new?: true;
}

// https://github.com/chakra-ui/chakra-ui/blob/6b0eaa05ff181875fb3629b82865407e6a70beb5/website/src/utils/get-route-context.ts#L11
interface Routes {
  routes: RouteItem[];
}

export type SidebarContentProps = Routes & {
  pathname?: string;
  contentRef?: any;
};

export function SidebarContent(props: SidebarContentProps) {
  const { routes, pathname, contentRef } = props;
  const color = useColorModeValue("gray.700", "inherit");
  return (
    <>
      {routes.map((lvl1, idx) => {
        return (
          <React.Fragment key={idx}>
            {lvl1.heading && (
              <chakra.h4
                fontSize="md"
                my="1.25rem"
                textTransform="uppercase"
                letterSpacing="wider"
                color={color}
              >
                {lvl1.title}
              </chakra.h4>
            )}

            {lvl1.routes!.map((lvl2, index) => {
              if (!lvl2.routes) {
                return (
                  <SidebarLink ml="-3" mt="2" key={lvl2.path} href={lvl2.path}>
                    {lvl2.title}
                  </SidebarLink>
                );
              }

              const selected = pathname!.startsWith(lvl2.path!);
              const opened = selected || lvl2.open;

              const sortedRoutes = lvl2.sort
                ? sortBy(lvl2.routes, (i) => i.title)
                : lvl2.routes;

              return (
                <SidebarCategory
                  contentRef={contentRef}
                  key={lvl2.path! + index}
                  title={lvl2.title}
                  selected={selected}
                  opened={opened}
                >
                  <Stack as="ul">
                    {sortedRoutes.map((lvl3) => (
                      <SidebarLink as="li" key={lvl3.path} href={lvl3.path}>
                        <span>{lvl3.title}</span>
                      </SidebarLink>
                    ))}
                  </Stack>
                </SidebarCategory>
              );
            })}
          </React.Fragment>
        );
      })}
    </>
  );
}

const Sidebar = ({ routes }: { routes: any }) => {
  const { pathname } = useRouter();
  const ref = React.useRef<HTMLDivElement>(null);

  return (
    <Box
      ref={ref}
      as="nav"
      aria-label="Main Navigation"
      pos="sticky"
      sx={{
        overscrollBehavior: "contain",
      }}
      top="6.5rem"
      w="280px"
      h="calc(100vh - 8.125rem)"
      pr="8"
      pb="6"
      pl="6"
      pt="4"
      overflowY="auto"
      className="sidebar-content"
      flexShrink={0}
      display={{ base: "none", md: "block" }}
    >
      <SidebarContent routes={routes} pathname={pathname} contentRef={ref} />
    </Box>
  );
};

export default Sidebar;
