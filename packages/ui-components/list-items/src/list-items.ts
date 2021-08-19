import { FlexProps, HTMLChakraProps, IconProps } from "@chakra-ui/react";
import { IconType } from "react-icons/lib";

export interface LeftIconListItemProps {
  icon: IconType;
  text: string;
  styles?: {
    flexContainerProps?: FlexProps;
    iconProps?: IconProps;
    textProps?: HTMLChakraProps<"p">;
  };
}
