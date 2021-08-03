import * as React from "react";
import {
  Box,
  BoxProps,
  Flex,
  FlexProps,
  Icon,
  IconProps,
  Spacer,
  useColorModeValue,
} from "@chakra-ui/react";
import Link from "next/link";
import {
  createCopyrightString,
  overrideStyles,
  SPACING_X_REACTIVE_VALUES,
} from "../theme/utils";
import { SimpleSocialFooterProps } from "./footer";

/**
 * Simple Footer component with legal links and social links inspired by Datadog: https://www.datadoghq.com/
 */
export const SimpleSocialFooter = (props: SimpleSocialFooterProps) => {
  const {
    companyName,
    privacyPolicyLink,
    termsOfServiceLink,
    socialLinks,
    styles,
  } = props;

  const defaultContainerStyles: FlexProps = {
    w: "100vw",
    py: ".5em",
    px: SPACING_X_REACTIVE_VALUES,
    display: "flex",
    flexWrap: "wrap",
    flexDirection: ["column", "row"],
    alignItems: ["center", "flex-start"],
  };

  const defaultCopyrightStyles: BoxProps = {
    verticalAlign: "middle",
    display: "inline-block",
    fontSize: ".8em",
    fontWeight: "thin",
    color: "gray.400",
    mr: ["0", "1em"],
  };

  const defaultLinkStyles: BoxProps = {
    verticalAlign: "middle",
    display: "inline-block",
    marginRight: "1em",
    marginLeft: "1em",
    color: useColorModeValue("black", "white"),
    _hover: {
      color: "gray.400",
    },
    fontSize: ".8em",
  };

  const defaultSocialLinkStyles: IconProps = {
    w: "1.2em",
    h: "100%",
    fill: useColorModeValue("black", "white"),
    mx: ".7em",
    _hover: {
      fill: "gray.400",
    },
  };

  return (
    <Flex
      {...overrideStyles(defaultContainerStyles, styles?.flexContainerProps)}
    >
      <Box>
        <Box
          {...overrideStyles(defaultCopyrightStyles, styles?.copyrightProps)}
        >
          {createCopyrightString(companyName, true)}
        </Box>
      </Box>
      <Box>
        <Link href={privacyPolicyLink.href} passHref>
          <Box
            as="a"
            {...overrideStyles(defaultLinkStyles, styles?.pageLinkProps)}
          >
            {privacyPolicyLink.text}
          </Box>
        </Link>
        <Link href={termsOfServiceLink.href} passHref>
          <Box
            as="a"
            {...overrideStyles(defaultLinkStyles, styles?.pageLinkProps)}
          >
            {termsOfServiceLink.text}
          </Box>
        </Link>
      </Box>
      <Spacer />
      <Box>
        {socialLinks.map((link) => (
          <Link href={link.href} passHref key={`footer-${link.text}`}>
            <a>
              <Icon
                {...overrideStyles(
                  defaultSocialLinkStyles,
                  styles?.socialLinkProps
                )}
              >
                {link.icon}
              </Icon>
            </a>
          </Link>
        ))}
      </Box>
    </Flex>
  );
};
