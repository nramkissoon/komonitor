import {
  BoxProps,
  DividerProps,
  FlexProps,
  GridProps,
  HeadingProps,
  IconProps,
  StackProps,
  WrapItemProps,
} from "@chakra-ui/react";
import { SimpleCenteredFooter } from "./simpleCenteredFooter";
import { SimpleSocialFooter } from "./simpleSocialFooter";
import React from "react";

/**
 * Props for a simple link.
 */
export interface FooterLinkProps {
  text: string;
  href: string;
}

/**
 * Props for a social link that would be displayed as an icon.
 */
export interface FooterSocialLinkProps extends FooterLinkProps {
  text: string;
  icon: React.ReactElement;
  href: string;
}

/**
 * Props for a simple footer.
 */
export interface SimpleFooterProps {
  companyName: string;
  privacyPolicyLink: FooterLinkProps;
  termsOfServiceLink: FooterLinkProps;
}

/**
 * Props for a section of social links in a footer.
 */
export interface FooterSocialLinkSectionProps extends FooterLinkSectionProps {
  sectionTitle: string;
  links: FooterSocialLinkProps[];
}

/**
 * Props for a simple footer with social links.
 */
export interface SimpleSocialFooterProps extends SimpleFooterProps {
  socialLinks: FooterSocialLinkProps[];
  /**
   * Style props
   */
  styles?: {
    /**
     * Props for the flex box container housing the footer.
     *
     * See https://chakra-ui.com/docs/layout/flex for documentation on Flex component.
     */
    flexContainerProps?: FlexProps;

    /**
     * Props for the Box component housing the copyright string.
     *
     * See https://chakra-ui.com/docs/layout/box for documentation on Box component.
     */
    copyrightProps?: BoxProps;

    /**
     * Props for the Box component housing the page link.
     *
     * See https://chakra-ui.com/docs/layout/box for documentation on Box component.
     */
    pageLinkProps?: BoxProps;

    /**
     * Props for the Icon component housing the page link.
     *
     * See https://chakra-ui.com/docs/media-and-icons/icon for documentation on Icon component.
     */
    socialLinkProps?: IconProps;
  };
}

/**
 * Props for a footer with multiple sections.
 */
export interface SectionedFooterProps {
  brandingImgSrc: string;
  companyName: string;
  linkSections: FooterLinkSectionProps[];
  socialSection?: FooterSocialLinkSectionProps;
}

/**
 * Props for a simple centered footer with a page link, (optional) social link, and copyright section.
 */
export interface SimpleCenteredFooterProps {
  /**
   * Links for other pages within website.
   */
  pageLinks: FooterLinkProps[];

  /**
   * Optional social links with icon.
   */
  socialLinks?: FooterSocialLinkProps[];

  /**
   * Copyright string
   */
  copyright: string;

  /**
   * Style props
   */
  styles?: {
    /**
     * Props for the flex box container housing the footer.
     *
     * See https://chakra-ui.com/docs/layout/flex for documentation on Flex component.
     */
    flexContainerProps?: FlexProps;

    /**
     * Props for the Wrap housing the page links section.
     *
     * See https://chakra-ui.com/docs/layout/wrap for documentation on Wrap component.
     */
    pageLinkWrapProps?: WrapProps;

    /**
     * Props for the Box component housing the page link.
     *
     * See https://chakra-ui.com/docs/layout/box for documentation on Box component.
     */
    pageLinkProps?: BoxProps;

    /**
     * Props for the Wrap housing the social links section.
     *
     * See https://chakra-ui.com/docs/layout/wrap for documentation on Wrap component.
     */
    socialLinkWrapProps?: WrapProps;

    /**
     * Props for the Icon component housing the page link.
     *
     * See https://chakra-ui.com/docs/media-and-icons/icon for documentation on Icon component.
     */
    socialLinkProps?: IconProps;

    /**
     * Props for the Box component housing the copyright string.
     *
     * See https://chakra-ui.com/docs/layout/box for documentation on Box component.
     */
    copyrightProps?: BoxProps;
  };
}

export interface FooterLinksColumnProps {
  columnTitle: React.ReactNode;
  links: FooterLinkProps[];
}

export interface BrandingSectionProps {
  icon: React.ReactNode;
  missionStatement?: React.ReactNode;
  socialLinks?: FooterSocialLinkProps[];
  styles?: {}; // TODO
}

export interface CtaSectionProps {
  header: React.ReactNode;
  subheader?: React.ReactNode;
  /**
   * @description CTA component. Typically this would be a sign up button or email form.
   */
  ctaComponent: React.ReactNode;
  styles?: {
    boxContainerProps?: BoxProps;
    headingProps?: HeadingProps;
    subheadingProps?: HeadingProps;
    ctaComponentContainerProps?: BoxProps;
  };
}

export interface FourColumnFooterProps {
  /**
   * @description a copyright section at the bottom of the footer.
   * Can be a string or a component such as {@link SimpleCenteredFooter}
   * or {@link SimpleSocialFooter}
   */
  copyright: React.ReactNode;

  firstColumn: FooterLinksColumnProps;
  secondColumn: FooterLinksColumnProps;
  thirdColumn: FooterLinksColumnProps;
  fourthColumn: FooterLinksColumnProps;

  /**
   * @description an optional section for components such as an email form or sign up CTA section.
   */
  extraSection?: {
    component: React.ReactNode;

    /**
     * @description placement relative to the link columns
     */
    placement: "right" | "left";
  };

  styles?: {
    /**
     * Props for the Box component housing the entire footer.
     */
    boxContainerProps?: BoxProps;

    /**
     * Props for the Flex component housing the columns and extra section.
     */
    flexContainerProps?: FlexProps;

    /**
     * Props for the Box component housing the extra section.
     */
    extraSectionContainerProps?: BoxProps;

    /**
     * Props for the Grid component housing the columns.
     */
    columnGridContainerProps?: GridProps;

    /**
     * Props for the VStack component representing a column.
     */
    columnProps?: StackProps;

    /**
     * Props for the Heading component that is the column title.
     */
    columnTitleProps?: HeadingProps;

    /**
     * Props for the Box components housing links in a column.
     */
    columnLinkProps?: BoxProps;

    /**
     * Props for the Divider component separating the columns from the copyright section.
     */
    dividerProps?: DividerProps;

    /**
     * Props for the Box component housing the copyright component.
     */
    copyrightContainerProps: BoxProps;
  };
}
