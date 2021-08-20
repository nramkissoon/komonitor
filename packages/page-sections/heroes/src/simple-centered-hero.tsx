import { Box, BoxProps, Flex, FlexProps } from "@chakra-ui/react";
import React from "react";
import { overrideStyles } from "@hyper-next/react-utils";
import { SimpleCenteredHeroProps } from "./hero";

export const SimpleCenteredHero = (props: SimpleCenteredHeroProps) => {
  const { header, subheader, ctaComponent, styles } = props;

  const defaultFlexContainerStyles: FlexProps = {
    w: "100%",
    py: "8em",
    px: ["5%", "5%", "10%", "15%", "20%"],
    flexDirection: "column",
    alignItems: "center",
  };

  const defaultHeaderContainerStyles: BoxProps = {};

  const defaultSubheaderContainerStyles: BoxProps = {
    mt: ".8em",
  };

  const defaultCtaComponentContainerStyles: BoxProps = {
    mt: "4.5em",
  };

  return (
    <Flex
      {...overrideStyles(
        defaultFlexContainerStyles,
        styles?.heroFlexContainerProps
      )}
    >
      <Box
        {...overrideStyles(
          defaultHeaderContainerStyles,
          styles?.headerBoxContainerProps
        )}
      >
        {header}
      </Box>
      {subheader ? (
        <Box
          {...overrideStyles(
            defaultSubheaderContainerStyles,
            styles?.subheaderBoxContainerProps
          )}
        >
          {subheader}
        </Box>
      ) : (
        <></>
      )}
      <Box
        {...overrideStyles(
          defaultCtaComponentContainerStyles,
          styles?.ctaComponentBoxContainerProps
        )}
      >
        {ctaComponent}
      </Box>
    </Flex>
  );
};
