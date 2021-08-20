import {
  Box,
  BoxProps,
  Flex,
  FlexProps,
  Icon,
  useColorModeValue,
  Wrap,
  WrapItem,
  WrapProps,
} from "@chakra-ui/react";
import * as React from "react";
import {
  overrideStyles,
  SPACING_X_REACTIVE_VALUES,
} from "@hyper-next/react-utils";
import { SimpleCenteredFooterProps } from "./footer";
import Link from "next/link";

export const SimpleCenteredFooter = (props: SimpleCenteredFooterProps) => {
  const { pageLinks, socialLinks, copyright, styles } = props;

  const defaultFlexContainerStyles: FlexProps = {
    w: "100%",
    py: ".5em",
    px: SPACING_X_REACTIVE_VALUES,
    display: "flex",
    flexWrap: "wrap",
    flexDirection: "column",
    alignItems: "center",
  };

  const defaultPageLinksWrapStyles: WrapProps = {
    justify: "center",
  };

  const defaultPageLinkStyles: BoxProps = {
    marginRight: "1em",
    marginLeft: "1em",
    fontWeight: "bold",
    color: useColorModeValue("black", "white"),
    _hover: {
      color: "gray.400",
    },
    fontSize: "1em",
  };

  const defaultSocialLinksWrapStyles: WrapProps = {
    justify: "center",
    mt: "1.8em",
  };

  const defaultSocialLinkStyles: BoxProps = {
    h: "100%",
    w: "1.4em",
    fill: useColorModeValue("black", "white"),
    mx: ".8em",
    _hover: {
      fill: "gray.400",
    },
  };

  const defaultCopyrightStyles: BoxProps = {
    fontSize: ".8em",
    fontWeight: "thin",
    mt: "3em",
    mb: "1.5em",
    color: useColorModeValue("black", "white"),
  };

  return (
    <Flex
      {...overrideStyles(
        defaultFlexContainerStyles,
        styles?.flexContainerProps
      )}
    >
      <Box>
        <Wrap
          {...overrideStyles(
            defaultPageLinksWrapStyles,
            styles?.pageLinkWrapProps
          )}
        >
          {pageLinks.map((pageLink) => (
            <WrapItem key={`footer-${pageLink.href}`}>
              <Link href={pageLink.href} passHref>
                <Box
                  as="a"
                  {...overrideStyles(
                    defaultPageLinkStyles,
                    styles?.pageLinkProps
                  )}
                >
                  {pageLink.text}
                </Box>
              </Link>
            </WrapItem>
          ))}
        </Wrap>
      </Box>
      {socialLinks ? (
        <Box>
          <Wrap
            {...overrideStyles(
              defaultSocialLinksWrapStyles,
              styles?.socialLinkWrapProps
            )}
          >
            {socialLinks.map((socialLink) => (
              <WrapItem key={`footer-social-${socialLink.href}`}>
                <Link href={socialLink.href} passHref>
                  <Box as="a">
                    <Icon
                      {...overrideStyles(
                        defaultSocialLinkStyles,
                        styles?.socialLinkProps
                      )}
                    >
                      {socialLink.icon}
                    </Icon>
                  </Box>
                </Link>
              </WrapItem>
            ))}
          </Wrap>
        </Box>
      ) : (
        <></>
      )}
      <Box>
        <Box
          {...overrideStyles(defaultCopyrightStyles, styles?.copyrightProps)}
        >
          {copyright}
        </Box>
      </Box>
    </Flex>
  );
};
