import {
  BoxProps,
  ButtonProps,
  FlexProps,
  HeadingProps,
} from "@chakra-ui/react";
import React from "react";
import { EmailSubmissionForm, EmailSubmissionFormProps } from "../forms/forms";

/**
 * @description Props for defining the behavior of a CTA section sign up button.
 */
export interface CtaSectionSignUpButtonProps {
  /**
   * @description Indicates if the user is authenticated which will determine button state.
   */
  isAuthed: boolean;

  buttonText: {
    /**
     * @description Text to display when user is authenticated. "Go to App"
     */
    authed: string;

    /**
     * @description Text to display when user is not authenticated. "Sign up"
     */
    notAuthed: string;
  };

  /**
   * @description Route to direct users to authenticate.
   */
  authRoute: string;

  /**
   * @description Route to direct users to the main application.
   */
  appRoute: string;
}

/**
 * @description Props for a simple CTA section that features a header, subheader, and a sign up button that redirects to the app's auth page.
 */
export interface SimpleSignUpCtaSectionProps {
  header: string;
  subheader?: string;
  ctaButtonProps: CtaSectionSignUpButtonProps;
  styles?: {
    /**
     * Props for the flex box container housing the CTA section.
     *
     * @see https://chakra-ui.com/docs/layout/flex for documentation on Flex component.
     */
    flexContainerProps?: FlexProps;

    /**
     * Props for the Heading component.
     *
     * @see https://chakra-ui.com/docs/typography/heading for documentation on Heading component.
     */
    headingProps?: HeadingProps;

    /**
     * Props for the Heading component.
     *
     * @see https://chakra-ui.com/docs/typography/heading for documentation on Heading component.
     */
    subheadingProps?: HeadingProps;

    /**
     * Props for the Button component of the CTA button.
     *
     * @see https://chakra-ui.com/docs/form/button for documentation on Button component.
     */
    ctaButtonProps?: ButtonProps;
  };
}

/**
 * @description Props for a simple CTA section with email submission form.
 */
export interface SimpleEmailSubmissionCtaSectionProps {
  header: string;
  subheader?: string;
  emailSubmissionForm: React.ReactNode;
  styles?: {
    /**
     * Props for the flex box container housing the CTA section.
     *
     * @see https://chakra-ui.com/docs/layout/flex for documentation on Flex component.
     */
    flexContainerProps?: FlexProps;

    /**
     * Props for the Heading component.
     *
     * @see https://chakra-ui.com/docs/typography/heading for documentation on Heading component.
     */
    headingProps?: HeadingProps;

    /**
     * Props for the Heading component.
     *
     * @see https://chakra-ui.com/docs/typography/heading for documentation on Heading component.
     */
    subheadingProps?: HeadingProps;

    /**
     * Props for the box container housing the email submission form.
     *
     * @see https://chakra-ui.com/docs/layout/box for documentation on Box component.
     */
    emailSubmissionFormContainerProps?: BoxProps;
  };
}
