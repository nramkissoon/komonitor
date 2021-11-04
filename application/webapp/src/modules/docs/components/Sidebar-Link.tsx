import { chakra, PropsOf, useColorModeValue } from "@chakra-ui/react";
import NextLink from "next/link";
import { useRouter } from "next/router";
import React from "react";

const StyledLink = React.forwardRef(function StyledLink(
  props: PropsOf<typeof chakra.a> & { isActive?: boolean },
  ref: React.Ref<any>
) {
  const { isActive, ...rest } = props;
  const ariaCurrent = isActive ? "page" : undefined;
  return (
    <chakra.a
      aria-current={ariaCurrent}
      width="100%"
      px="3"
      py="1"
      rounded="md"
      ref={ref}
      fontSize="md"
      fontWeight="500"
      color={useColorModeValue("gray.700", "whiteAlpha.900")}
      transition="all 0.2s"
      _activeLink={{
        bg: useColorModeValue("blue.100", "blue.600"),
        color: useColorModeValue("blue.800", "white"),
        fontWeight: "semibold",
      }}
      {...rest}
    />
  );
});

type SidebarLinkProps = PropsOf<typeof chakra.div> & {
  href?: string;
  icon?: React.ReactElement;
};

const SidebarLink = (props: SidebarLinkProps) => {
  const { href, icon, children, ...rest } = props;

  const { asPath } = useRouter();
  const isActive = asPath === href;

  return (
    <chakra.div
      userSelect="none"
      display="flex"
      alignItems="center"
      lineHeight="1.5rem"
      {...rest}
    >
      <NextLink href={href as any} passHref>
        <StyledLink isActive={isActive}>{children}</StyledLink>
      </NextLink>
    </chakra.div>
  );
};

export default SidebarLink;
