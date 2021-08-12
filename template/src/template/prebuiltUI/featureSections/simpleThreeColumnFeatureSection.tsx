import {
  useColorModeValue,
  Flex,
  FlexProps,
  SimpleGrid,
  SimpleGridProps,
} from "@chakra-ui/react";
import React from "react";
import { overrideStyles } from "../theme/utils";
import { SimpleThreeColumnFeatureSectionProps } from "./featureSections";

export const SimpleThreeColumnFeatureSection = (
  props: SimpleThreeColumnFeatureSectionProps
) => {
  const { featureItems, styles } = props;

  const defaultFlexContainerProps: FlexProps = {
    bg: useColorModeValue("gray.300", "gray.600"),
    p: 20,
    w: "auto",
    justifyContent: "center",
    alignItems: "center",
  };

  const defaultGridContainerProps: SimpleGridProps = {
    columns: { base: 1, md: 3 },
    spacing: 20,
    px: { base: 4, lg: 16, xl: 24 },
    py: 20,
    mx: "auto",
    bg: useColorModeValue("white", "gray.800"),
    shadow: "xl",
  };

  return (
    <Flex
      {...overrideStyles(defaultFlexContainerProps, styles?.flexContainerProps)}
    >
      <SimpleGrid
        {...overrideStyles(
          defaultGridContainerProps,
          styles?.innerGridContainerProps
        )}
      >
        {featureItems.map((item) => item)}
      </SimpleGrid>
    </Flex>
  );
};
