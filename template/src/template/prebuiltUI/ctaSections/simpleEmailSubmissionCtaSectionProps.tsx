import React from "react";
import { Box, Flex, FlexProps, Heading, HeadingProps } from "@chakra-ui/layout";
import { overrideStyles } from "../theme/utils";
import { SimpleEmailSubmissionCtaSectionProps } from "./ctaSection";
import { BoxProps } from "@chakra-ui/react";

/**
 * @description A centered CTA section that features a header, (optional) subheader, and an email submission form.
 *
 * @param props {@link SimpleEmailSubmissionCtaSectionProps}
 * @returns A CTA section with an email submission form
 */
export const SimpleEmailSubmissionCtaSection = (
  props: SimpleEmailSubmissionCtaSectionProps
) => {
  const { header, subheader, emailSubmissionForm, styles } = props;

  const defaultFlexContainerStyles: FlexProps = {
    w: "100vw",
    py: "8em",
    px: ["5vw", "5vw", "10vw", "15vw", "20vw"],
    display: "flex",
    flexWrap: "wrap",
    flexDirection: "column",
    alignItems: "center",
  };

  const defaultHeadingProps: HeadingProps = {
    as: "h2",
    size: "3xl",
    textAlign: "center",
  };

  const defaultSubheadingProps: HeadingProps = {
    as: "h3",
    size: "lg",
    textAlign: "center",
    color: "gray.600",
    mt: ".8em",
  };

  const defaultEmailSubmissionFormContainerPros: BoxProps = {
    w: ["300px", "450px", null, null, "550px", "600px"],
    mt: "4.5em",
  };

  return (
    <Flex
      {...overrideStyles(
        defaultFlexContainerStyles,
        styles?.flexContainerProps
      )}
    >
      <Box>
        <Heading {...overrideStyles(defaultHeadingProps, styles?.headingProps)}>
          {header}
        </Heading>
      </Box>
      {subheader ? (
        <Box>
          <Heading
            {...overrideStyles(defaultSubheadingProps, styles?.subheadingProps)}
          >
            {subheader}
          </Heading>
        </Box>
      ) : (
        <></>
      )}
      <Box
        {...overrideStyles(
          defaultEmailSubmissionFormContainerPros,
          styles?.emailSubmissionFormContainerProps
        )}
      >
        {emailSubmissionForm}
      </Box>
    </Flex>
  );
};
