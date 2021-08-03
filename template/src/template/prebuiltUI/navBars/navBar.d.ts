import {
  BackgroundProps,
  CSSObject,
  HTMLChakraProps,
  SystemCSSProperties,
} from "@chakra-ui/react";
import React from "react";

/**
 * Props for a top level link in a navigation bar.
 */
export interface NavBarLinkProps {
  text: string;
  href: string;
  type: "link";
}

/**
 * Props for a drop down menu in a navigation bar.
 */
export interface DropDownProps {
  title: string;
  links: NavBarLinkProps[];
  type: "dropdown";
}

/**
 * Style props for overriding the default styling of a navigation bar.
 * These props use the Chakra styling API.
 */
export interface NavBarStyleProps {
  containerStyle?: HTMLChakraProps<"div">;
  brandingImageStyle?: HTMLChakraProps<"img">;
  linkStyles?: {
    dropDownMenuButtonStyles?: HTMLChakraProps<"div">;
    dropDownLinkStyles?: HTMLChakraProps<"div">;
    topLevelLinkStyles?: HTMLChakraProps<"div">;
  };
}

/**
 * Basic props for a navigation bar. These props define the components of the
 * navbar and any special logic based on the isAuthed boolean.
 */
export interface BaseNavBarProps {
  isAuthed: boolean;
  loginButton: React.ReactElement;
  companyIcon: string;
  links: (NavBarLinkProps | DropDownProps)[];
  styles?: NavBarStyleProps;
}
