import {
  Box,
  BoxProps,
  Divider,
  DividerProps,
  Flex,
  FlexProps,
  Grid,
  GridProps,
  Heading,
  HeadingProps,
  StackProps,
  VStack,
} from "@chakra-ui/react";
import Link from "next/link";
import React from "react";
import {
  overrideStyles,
  SPACING_X_REACTIVE_VALUES,
} from "@hyper-next/react-utils";
import { FourColumnFooterProps } from "./footer";

/**
 * @description A customizable footer that features four columns of page links, an optional CTA section, and a copyright notice section.
 *
 * @param props {@link FourColumnFooterProps}
 * @returns a four column footer
 */
export const FourColumnFooterBase = (props: FourColumnFooterProps) => {
  const {
    copyright,
    firstColumn,
    secondColumn,
    thirdColumn,
    fourthColumn,
    extraSection,
    styles,
  } = props;

  const columns = [firstColumn, secondColumn, thirdColumn, fourthColumn];

  const defaultContainerStyles: BoxProps = {
    w: "100vw",
    py: "2em",
    px: SPACING_X_REACTIVE_VALUES,
  };

  const defaultFlexContainerStyles: FlexProps = {
    flexDirection: [
      extraSection?.placement === "left" ? "column" : "column-reverse",
      null,
      null,
      "row",
    ],
    alignItems: ["center", null, null, "flex-start"],
    justifyContent: "space-evenly",
  };

  const defaultExtraSectionContainerStyles: BoxProps = {
    flexGrow: 1.2,
    maxWidth: "450px",
  };

  const defaultColumnGridContainerStyles: GridProps = {
    mt: ["2em", null, null, 0],
    templateColumns: [
      "repeat(1, 1fr)",
      "repeat(2, 1fr)",
      null,
      "repeat(4, 1fr)",
    ],
  };

  const defaultColumnStyles: StackProps = {
    mx: ["3.5em", "5em", null, "2em", "2em", "3em"],
    mb: ["2em", "1em", null, 0],
  };

  const defaultColumnTitleStyles: HeadingProps = {
    size: "sm",
    as: "h5",
    color: "gray.600",
  };

  const defaultColumnLinkStyles: BoxProps = {
    color: "gray.500",
    _hover: { color: "gray.700" },
  };

  const defaultDividerStyles: DividerProps = {
    mt: "2em",
    borderColor: "gray.500",
  };

  const defaultCopyrightContainerStyles: BoxProps = {
    mt: "1em",
    textAlign: "center",
    color: "gray.500",
  };

  return (
    <Box {...overrideStyles(defaultContainerStyles, styles?.boxContainerProps)}>
      <Flex
        {...overrideStyles(
          defaultFlexContainerStyles,
          styles?.flexContainerProps
        )}
      >
        {extraSection?.placement === "left" ? (
          <Box
            {...overrideStyles(
              defaultExtraSectionContainerStyles,
              styles?.extraSectionContainerProps
            )}
          >
            {extraSection.component}
          </Box>
        ) : (
          <></>
        )}
        <Grid
          {...overrideStyles(
            defaultColumnGridContainerStyles,
            styles?.columnGridContainerProps
          )}
        >
          {columns.map((column) => (
            <VStack
              key={`footer-column-${column.columnTitle}`}
              {...overrideStyles(defaultColumnStyles, styles?.columnProps)}
            >
              <Heading
                {...overrideStyles(
                  defaultColumnTitleStyles,
                  styles?.columnTitleProps
                )}
              >
                {column.columnTitle}
              </Heading>
              {column.links.map((link) => (
                <Link
                  key={`footer-column-${column.columnTitle}-${link.text}`}
                  href={link.href}
                  passHref
                >
                  <Box
                    as="a"
                    {...overrideStyles(
                      defaultColumnLinkStyles,
                      styles?.columnLinkProps
                    )}
                  >
                    {link.text}
                  </Box>
                </Link>
              ))}
            </VStack>
          ))}
        </Grid>
        {extraSection?.placement === "right" ? (
          <Box
            {...overrideStyles(
              defaultExtraSectionContainerStyles,
              styles?.extraSectionContainerProps
            )}
          >
            {extraSection.component}
          </Box>
        ) : (
          <></>
        )}
      </Flex>
      <Divider
        {...overrideStyles(defaultDividerStyles, styles?.dividerProps)}
      />
      <Box
        {...overrideStyles(
          defaultCopyrightContainerStyles,
          styles?.copyrightContainerProps
        )}
      >
        {copyright}
      </Box>
    </Box>
  );
};
