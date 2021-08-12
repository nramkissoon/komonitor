import {
  Box,
  BoxProps,
  chakra,
  Flex,
  FlexProps,
  HTMLChakraProps,
  SimpleGrid,
  SimpleGridProps,
  useColorModeValue,
} from "@chakra-ui/react";
import React from "react";
import { overrideStyles } from "../theme/utils";
import { GridListFeatureSectionProps } from "./featureSections";

export const GridListFeatureSection = (props: GridListFeatureSectionProps) => {
  const { listItems, title, subtitle, styles } = props;

  const defaultFlexContainerStyles: FlexProps = {
    bg: useColorModeValue("#F9FAFB", "gray.600"),
    p: 20,
    w: "auto",
    justifyContent: "center",
    alignItems: "center",
  };

  const defaultInnerSectionBoxContainerStyles: BoxProps = {
    px: 8,
    py: 20,
    mx: "auto",
    bg: useColorModeValue("white", "gray.800"),
    shadow: "xl",
  };

  const defaultTextContentBoxContainerStyles: BoxProps = {
    textAlign: { lg: "center" },
  };

  const defaultTitleStyles: HTMLChakraProps<"p"> = {
    mt: 2,
    fontSize: { base: "3xl", sm: "4xl" },
    lineHeight: 8,
    fontWeight: "extrabold",
    letterSpacing: "tight",
    color: useColorModeValue("gray.900", "white"),
  };

  const defaultSubtitleStyles: HTMLChakraProps<"p"> = {
    mt: 4,
    maxW: "2xl",
    fontSize: "xl",
    mx: { lg: "auto" },
    color: useColorModeValue("gray.500", "gray.400"),
  };

  const defaultGridStyles: SimpleGridProps = {
    columns: { base: 1, sm: 2, md: 3, lg: 4 },
    spacingX: { base: 16, lg: 24 },
    spacingY: 20,
    mt: 6,
  };

  return (
    <Flex
      {...overrideStyles(
        defaultFlexContainerStyles,
        styles?.flexContainerProps
      )}
    >
      <Box
        {...overrideStyles(
          defaultInnerSectionBoxContainerStyles,
          styles?.innerSectionBoxContainerProps
        )}
      >
        <Box
          {...overrideStyles(
            defaultTextContentBoxContainerStyles,
            styles?.textContentBoxContainerProps
          )}
        >
          <chakra.p {...overrideStyles(defaultTitleStyles, styles?.titleProps)}>
            {title}
          </chakra.p>
          {subtitle ? (
            <chakra.p
              {...overrideStyles(defaultSubtitleStyles, styles?.subtitleProps)}
            >
              {subtitle}
            </chakra.p>
          ) : (
            <></>
          )}
        </Box>
        <SimpleGrid {...overrideStyles(defaultGridStyles, styles?.gridProps)}>
          {listItems}
        </SimpleGrid>
      </Box>
    </Flex>
  );
};
