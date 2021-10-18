import {
  Button,
  ButtonProps,
  Flex,
  FlexProps,
  Heading,
  SimpleGrid,
  useColorModeValue,
  VStack,
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
    fontSize: "lg",
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

const LinkColumn = (props: { header: string; links: React.ReactElement[] }) => {
  const { links, header } = props;
  return (
    <VStack>
      <Heading color={useColorModeValue("gray.900", "gray.300")} fontSize="xl">
        {header}
      </Heading>
      {links}
    </VStack>
  );
};

export function Footer() {
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

  const year = new Date().getFullYear();

  return (
    <Flex {...containerBoxStyles}>
      <SimpleGrid
        columns={[1, 1, 2, 3]}
        spacingX={[6, 40]}
        spacingY={[20]}
        mb="1.5em"
      >
        <LinkColumn
          header="Komonitor"
          links={[
            <HeaderLink text="About" href="/about" />,
            <HeaderLink text="Status" href="/status" />,
            <HeaderLink text="Contact" href="/contact" />,
          ]}
        />
        <LinkColumn
          header="Resources"
          links={[
            <HeaderLink text="Documentation" href="/docs" />,
            <HeaderLink text="Changelog" href="/changelog" />,
            <HeaderLink text="Roadmap" href="/roadmap" />,
          ]}
        />
        <LinkColumn
          header="Legal"
          links={[
            <HeaderLink text="Privacy" href="/privacy" />,
            <HeaderLink text="Terms of Service" href="/tos" />,
          ]}
        />
      </SimpleGrid>
      © {year} Nicholas Ramkissoon. All rights reserved.
    </Flex>
  );
}
