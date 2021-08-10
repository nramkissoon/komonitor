import {
  BoxProps,
  ButtonProps,
  FlexProps,
  HTMLChakraProps,
  StackProps,
} from "@chakra-ui/react";
import React, { MouseEventHandler } from "react";

export interface BasicCardProps {
  icon?: React.ReactNode;
  title: string;
  body: string;
  styles?: {
    iconFlexContainerProps?: FlexProps;
    titleProps?: HTMLChakraProps<"h3">;
    bodyProps?: HTMLChakraProps<"p">;
  };
}

export interface BasicPricingCardProps {
  productTitle: string;
  price: string;
  pricePeriod?: string;
  buttonOnClick: MouseEventHandler<HTMLButtonElement>;
  buttonText: string;
  featureItems: React.ReactNode[];
  styles?: {
    flexContainerProps?: FlexProps;
    vstackContainerProps?: StackProps;
    productTitleProps?: HTMLChakraProps<"span">;
    priceHstackContainerProps?: StackProps;
    priceNumberProps?: HTMLChakraProps<"span">;
    pricePeriodProps?: HTMLChakraProps<"span">;
    bottomSectionVstackContainerProps?: StackProps;
    featureVstackContainerProps?: StackProps;
    buttonBoxContainerProps?: BoxProps;
    buttonProps?: ButtonProps;
  };
}
