import { ButtonProps, FlexProps, HeadingProps } from "@chakra-ui/react";
import React from "react";

/**
 * Props for defining the functionality of a CTA section sign up button.
 */
export interface CtaSectionSignUpButtonProps {
  /**
   * Indicates if the user is authenticated which will determine button state.
   */
  isAuthed: boolean;

  buttonText: {
    /**
     * Text to display when user is authenticated. "Go to App"
     */
    authed: string;

    /**
     * Text to display when user is not authenticated. "Sign up"
     */
    notAuthed: string;
  };

  /**
   * Route to direct users to authenticate.
   */
  authRoute: string;

  /**
   * Route to direct users to the main application.
   */
  appRoute: string;
}

/**
 * Props for a simple CTA section that features a header, subheader, and a sign up button that redirects to the
 * app's auth page.
 */
export interface SimpleSignUpCtaSectionProps {
  header: string;
  subheader?: string;
  ctaButtonProps: CtaSectionSignUpButtonProps;
  styles?: {
    /**
     * Props for the flex box container housing the CTA section.
     *
     * See https://chakra-ui.com/docs/layout/flex for documentation on Flex component.
     */
    flexContainerProps?: FlexProps;

    /**
     * Props for the Heading component.
     *
     * See https://chakra-ui.com/docs/typography/heading for documentation on Heading component.
     */
    headingProps?: HeadingProps;

    /**
     * Props for the Heading component.
     *
     * See https://chakra-ui.com/docs/typography/heading for documentation on Heading component.
     */
    subheadingProps?: HeadingProps;

    /**
     * Props for the Button component of the CTA button.
     *
     * See https://chakra-ui.com/docs/form/button for documentation on Button component.
     */
    ctaButtonProps?: ButtonProps;
  };
}
