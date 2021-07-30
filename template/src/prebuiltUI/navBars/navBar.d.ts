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
  styles?: HTMLChakraProps<"div">;
}

/**
 * Props for a drop down menu in a navigation bar.
 */
export interface DropDownProps {
  title: string;
  links: NavBarLinkProps[];
  type: "dropdown";
  linkStyles?: {
    menuButtonStyles?: HTMLChakraProps<"div">;
    dropDownLinkStyles?: HTMLChakraProps<"div">;
    topLevelLinkStyles?: HTMLChakraProps<"div">;
  };
}

/**
 * Style props for overriding the default styling of a navigation bar.
 * These props use the Chakra styling API.
 */
export interface NavBarStyleProps {
  containerStyle?: HTMLChakraProps<"div">;
  brandingImageStyle?: HTMLChakraProps<"img">;
  linkStyles?: {
    menuButtonStyles?: HTMLChakraProps<"div">;
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
  brandingImageSrc: string;
  links: (LinkProps | DropDownProps)[];
  navBarStyles?: NavBarStyleProps;
}
