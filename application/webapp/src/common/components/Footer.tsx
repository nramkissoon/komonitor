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
  useColorModeValue: Function;
  buttonProps?: ButtonProps;
}) => {
  const { text, href, buttonProps, useColorModeValue } = props;

  const defaultButtonLinkStyles: ButtonProps = {
    color: useColorModeValue("gray.900", "gray.400"),
    alignItems: "center",
    variant: "ghost",
    fontWeight: "medium",
    fontSize: "md",
    _focus: { boxShadow: "none" },
    _hover: {
      color: useColorModeValue("inherit", "white"),
      bg: useColorModeValue("gray.200", "gray.600"),
    },
    as: "a",
    rounded: "md",
  };
  return (
    <Link href={href} passHref>
      <Button {...defaultButtonLinkStyles} {...buttonProps} py="0">
        {text}
      </Button>
    </Link>
  );
};

const StripeClimateLink = (props: {
  text: string;
  href: string;
  useColorModeValue: Function;
  buttonProps?: ButtonProps;
}) => {
  const { text, href, buttonProps, useColorModeValue } = props;

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

const LinkColumn = (props: {
  header: string;
  links: React.ReactElement[];
  useColorModeValue: Function;
}) => {
  const { links, header, useColorModeValue } = props;
  return (
    <VStack>
      <Heading color={useColorModeValue("gray.900", "gray.300")} fontSize="xl">
        {header}
      </Heading>
      {links}
    </VStack>
  );
};

export function Footer({ lightModeOnly }: { lightModeOnly?: boolean }) {
  let useColorModeValueModified = (light: string, dark: string) => {
    if (lightModeOnly === true) return useColorModeValue(light, light);
    return useColorModeValue(light, dark);
  };

  const containerBoxStyles: FlexProps = {
    h: "3em",
    mt: "auto",
    textAlign: "center",
    w: "100%",
    p: "1em",
    flexDir: "column",
    alignItems: "center",
    borderTopColor: useColorModeValueModified("gray.100", "gray.800"),
    borderTopWidth: useColorModeValueModified("0px", "1px"),
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
          header="Why Komonitor?"
          useColorModeValue={useColorModeValueModified}
          links={[
            <HeaderLink
              text="Uptime Monitoring"
              href="/uptime"
              key="uptime"
              useColorModeValue={useColorModeValueModified}
            />,

            <HeaderLink
              text="Integrations"
              href="/integrations"
              key="integrations"
              useColorModeValue={useColorModeValueModified}
            />,
          ]}
        />

        <LinkColumn
          useColorModeValue={useColorModeValueModified}
          header="Resources"
          links={[
            <HeaderLink
              text="Pricing"
              href="/pricing"
              key="pricing"
              useColorModeValue={useColorModeValueModified}
            />,
            <HeaderLink
              text="Documentation"
              href="/docs/getting-started/introduction"
              key="docs"
              useColorModeValue={useColorModeValueModified}
            />,

            <HeaderLink
              text="Blog"
              href="/blog"
              key="blog"
              useColorModeValue={useColorModeValueModified}
            />,
          ]}
        />
        <LinkColumn
          useColorModeValue={useColorModeValueModified}
          header="Company"
          links={[
            <HeaderLink
              text="Contact"
              href="mailto:support@komonitor.com"
              key="contact"
              useColorModeValue={useColorModeValueModified}
            />,
            <HeaderLink
              text="Privacy"
              href="/privacy"
              key="privacy"
              useColorModeValue={useColorModeValueModified}
            />,
            <HeaderLink
              text="Terms of Service"
              href="/tos"
              key="tos"
              useColorModeValue={useColorModeValueModified}
            />,
          ]}
        />
      </SimpleGrid>
    </Flex>
  );
}
