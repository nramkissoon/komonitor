import {
  BoxProps,
  FlexProps,
  IconProps,
  WrapItemProps,
} from "@chakra-ui/react";
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
 * Props for a section of related links in a footer.
 */
export interface FooterLinkSectionProps {
  sectionTitle: string;
  links: FooterLinkProps[];
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
