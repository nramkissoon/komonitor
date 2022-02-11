import {
  Button,
  ButtonProps,
  Flex,
  FlexProps,
  HStack,
  StackProps,
  useColorModeValue,
} from "@chakra-ui/react";
import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";

const HeaderLink = (props: {
  text: string;
  href: string;
  buttonProps?: ButtonProps;
}) => {
  const { text, href, buttonProps } = props;
  const router = useRouter();

  const selected = router.asPath.startsWith(href);

  const defaultButtonLinkStyles: ButtonProps = {
    color: !selected ? useColorModeValue("gray.900", "gray.400") : "blue.400",
    display: "inline-flex",
    alignItems: "center",
    variant: "ghost",
    fontWeight: "medium",
    fontSize: "medium",
    _focus: { boxShadow: "none" },
    _hover: { color: useColorModeValue("gray.500", "white") },
    as: "a",
  };

  return (
    <Link href={href} passHref>
      <Button {...defaultButtonLinkStyles} {...buttonProps}>
        {text}
      </Button>
    </Link>
  );
};

export function AppFooter() {
  const containerBoxStyles: FlexProps = {
    h: "3em",
    mt: "auto",
    textAlign: "center",
    w: "100%",
    p: "1em",
    flexDir: "column",
    alignItems: "center",
    borderTopColor: useColorModeValue("gray.100", "gray.800"),
    borderTopWidth: useColorModeValue("0px", "1px"),
  };

  const defaultLinksHstackContainerStyles: StackProps = {
    spacing: "6",
    fontSize: "lg",
  };

  const year = new Date().getFullYear();

  return (
    <Flex {...containerBoxStyles} as="footer">
      <HStack {...defaultLinksHstackContainerStyles} mb="1em">
        <HeaderLink text="Docs" href="/docs" />
        <HeaderLink text="Blog" href="/blog" />
      </HStack>
      © {year} Nicholas Ramkissoon. All rights reserved.
    </Flex>
  );
}
