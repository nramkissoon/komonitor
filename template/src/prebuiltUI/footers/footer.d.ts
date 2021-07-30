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
  text: string; // used as alt for icon
  icon: string;
  href: string;
}

/**
 * Props for a simple footer.
 */
export interface SimpleFooterProps {
  brandingImgSrc: string;
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
  socialSection: FooterSocialLinkSectionProp;
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
