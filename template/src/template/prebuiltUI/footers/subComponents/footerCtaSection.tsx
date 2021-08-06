import React from "react";
import { Box, BoxProps, Heading, HeadingProps } from "@chakra-ui/react";
import { CtaSectionProps } from "../footer";
import { overrideStyles } from "../../theme/utils";

/**
 * @description A CTA section that goes inside of a footer. The CTA component is user defined, it can be a button or form for example.
 *
 * @param props {@link CtaSectionProps}
 * @returns A CTA section that goes inside of a footer.
 */
export const FooterCtaSection = (props: CtaSectionProps) => {
  const { header, subheader, ctaComponent, styles } = props;

  const defaultBoxContainerStyles: BoxProps = {
    w: "100%",
  };

  const defaultHeadingProps: HeadingProps = {
    as: "h4",
    size: "md",
    color: "gray.600",
  };

  const defaultSubheadingProps: HeadingProps = {
    as: "h5",
    size: "sm",
    fontWeight: "normal",
    color: "gray.600",
    mt: ".1em",
  };

  const defaultCtaComponentContainerProps: BoxProps = {
    mt: "1em",
  };

  return (
    <Box
      {...overrideStyles(defaultBoxContainerStyles, styles?.boxContainerProps)}
    >
      <Heading {...overrideStyles(defaultHeadingProps, styles?.headingProps)}>
        {header}
      </Heading>
      {subheader ? (
        <Heading
          {...overrideStyles(defaultSubheadingProps, styles?.subheadingProps)}
        >
          {subheader}
        </Heading>
      ) : (
        <></>
      )}
      <Box
        {...overrideStyles(
          defaultCtaComponentContainerProps,
          styles?.ctaComponentContainerProps
        )}
      >
        {ctaComponent}
      </Box>
    </Box>
  );
};
