import React from "react";
import {
  BoxProps,
  HTMLChakraProps,
  FlexProps,
  SimpleGridProps,
  GridProps,
} from "@chakra-ui/react";

/**
 * Props for a feature section with a grid of feature cards.
 */
export interface GridListFeatureSectionProps {
  title: string;
  subtitle?: string;

  /**
   * Feature card components.
   */
  listItems: React.ReactNode[];
  styles?: {
    /**
     * Props for the flex box container housing the section.
     */
    flexContainerProps?: FlexProps;

    /**
     * Props for the inner box components housing the section content.
     */
    innerSectionBoxContainerProps?: BoxProps;

    /**
     * Props for the box component housing the title and subtitle.
     */
    textContentBoxContainerProps?: BoxProps;

    titleProps?: HTMLChakraProps<"p">;
    subtitleProps?: HTMLChakraProps<"p">;

    /**
     * Props for the grid component containing the feature cards.
     */
    gridProps?: SimpleGridProps;
  };
}

export interface SimpleThreeColumnFeatureSectionProps {
  featureItems: React.ReactNode[];
  styles?: {
    flexContainerProps?: FlexProps;
    innerGridContainerProps?: GridProps;
  };
}
