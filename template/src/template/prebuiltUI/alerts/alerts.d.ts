import {
  BoxProps,
  FlexProps,
  HTMLChakraProps,
  IconProps,
} from "@chakra-ui/react";
import React from "react";

export interface LeftIconAlertProps {
  icon: As<any> | undefined;
  header: string;
  subheader: string;
  styles?: {
    flexContainerProps?: FlexProps;
    iconFlexContainerProps?: FlexProps;
    iconProps?: IconProps;
    textBoxContainerProps?: BoxProps;
    headerProps?: HTMLChakraProps<"span">;
    subheaderProps?: HTMLChakraProps<"p">;
  };
}
