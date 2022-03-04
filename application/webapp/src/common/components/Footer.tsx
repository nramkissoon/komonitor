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
import React from "react";

const HeaderLink = (props: {
  text: string;
  href: string;
  buttonProps?: ButtonProps;
}) => {
  const { text, href, buttonProps } = props;

  const defaultButtonLinkStyles: ButtonProps = {
    color: useColorModeValue("gray.900", "gray.400"),
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

const StripeClimateLink = (props: {
  text: string;
  href: string;
  buttonProps?: ButtonProps;
}) => {
  const { text, href, buttonProps } = props;

  const defaultButtonLinkStyles: ButtonProps = {
    color: useColorModeValue("gray.900", "gray.400"),
    display: "inline-flex",
    alignItems: "center",
    variant: "ghost",
    fontWeight: "medium",
    fontSize: "lg",
    _focus: { boxShadow: "none" },
    _hover: { color: useColorModeValue("gray.500", "white") },
    as: "div",
  };
  return (
    <a href={href} target="_blank" rel="noopener">
      <Button {...defaultButtonLinkStyles} {...buttonProps}>
        {text}
      </Button>
    </a>
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
    <Flex {...containerBoxStyles} as="footer">
      <SimpleGrid
        columns={[1, 1, 2, 3]}
        spacingX={[6, 40]}
        spacingY={[20]}
        pb="2em"
      >
        <LinkColumn
          header="Product"
          links={[
            <HeaderLink text="Uptime Monitoring" href="/uptime" key="uptime" />,

            <HeaderLink
              text="Integrations"
              href="/integrations"
              key="integrations"
            />,
          ]}
        />

        <LinkColumn
          header="Resources"
          links={[
            <HeaderLink text="Pricing" href="/pricing" key="pricing" />,
            <HeaderLink
              text="Documentation"
              href="/docs/getting-started/introduction"
              key="docs"
            />,

            <HeaderLink text="Blog" href="/blog" key="blog" />,
          ]}
        />
        <LinkColumn
          header="Company"
          links={[
            <HeaderLink
              text="Contact"
              href="mailto:support@komonitor.com"
              key="contact"
            />,
            <HeaderLink text="Privacy" href="/privacy" key="privacy" />,
            <HeaderLink text="Terms of Service" href="/tos" key="tos" />,
          ]}
        />
      </SimpleGrid>
    </Flex>
  );
}
