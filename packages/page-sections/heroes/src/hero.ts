import { BoxProps, FlexProps } from "@chakra-ui/react";
import React from "react";

export interface HeroBaseProps {
  header: React.ReactNode;
  subheader?: React.ReactNode;
  ctaComponent: React.ReactNode;
}

export interface SimpleCenteredHeroProps extends HeroBaseProps {
  styles?: {
    heroFlexContainerProps?: FlexProps;
    headerBoxContainerProps?: BoxProps;
    subheaderBoxContainerProps?: BoxProps;
    ctaComponentBoxContainerProps?: BoxProps;
  };
}
