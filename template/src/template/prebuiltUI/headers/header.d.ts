import {
  BackgroundProps,
  BoxProps,
  CSSObject,
  FlexProps,
  HTMLChakraProps,
  ImgProps,
  MenuButtonProps,
  MenuListProps,
  SystemCSSProperties,
} from "@chakra-ui/react";
import React from "react";

/**
 * Props for a top level link in a navigation bar.
 */
export interface HeaderLinkProps {
  text: string;
  href: string;
  type: "link";
}

/**
 * Props for a drop down menu in a navigation bar.
 */
export interface HeaderDropDownProps {
  title: string;
  links: HeaderLinkProps[];
  type: "dropdown";
}

/**
 * Props for a basic header component.
 */
export interface BasicHeaderProps {
  /**
   * Boolean flag to indicate if the user is authed and to change the
   * appearance of the header.
   */
  isAuthed: boolean;

  /**
   * Login button component.
   */
  loginButton: React.ReactElement;

  /**
   * Path to the asset that will be used for the company branding on the
   * header.
   */
  companyIcon: string;

  /**
   * A list of page links and drop down menu props.
   */
  links: (HeaderLinkProps | DropDownProps)[];

  /**
   * Styles for controlling the look of individual header components.
   */
  styles?: {
    /**
     * Props for the flex box container housing the header.
     *
     * See https://chakra-ui.com/docs/layout/flex for documentation on Flex component.
     */
    flexContainerProps?: FlexProps;

    /**
     * Props for the Img component for the branding image.
     *
     * See https://chakra-ui.com/docs/media-and-icons/image for documentation on Img component.
     */
    brandingImgProps?: ImgProps;

    /**
     * Props for the Box component housing the header links.
     *
     * See https://chakra-ui.com/docs/layout/box for documentation on Box component.
     */
    headerLinkProps?: BoxProps;

    /**
     * Props for the Menu Button component for a drop down.
     *
     * See https://chakra-ui.com/docs/overlay/menu for documentation on Menu Button component.
     */
    dropDownMenuButtonProps?: MenuButtonProps;

    /**
     * Props for the Menu List component for a drop down.
     *
     * See https://chakra-ui.com/docs/overlay/menu for documentation on Menu List component.
     */
    dropDownMenuListProps?: MenuListProps;
  };
}
