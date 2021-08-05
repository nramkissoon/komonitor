import {
  ButtonProps,
  FlexProps,
  FormErrorMessageProps,
  HTMLChakraProps,
  InputProps,
  FormHelperText,
  Input,
  Button,
  Flex,
  FormErrorMessage,
} from "@chakra-ui/react";
import { FormikHelpers } from "formik";
import React from "react";

/**
 * @description Formik values needed for an email submission component.
 */
export interface EmailSubmissionFormikValues {
  email: string;
}

/**
 * @description Callback function for email submission component.
 *
 * @param values {@link EmailSubmissionFormikValues}
 * @param actions {@link FormikHelpers}
 * @return void
 */
export type EmailSubmissionFormOnSubmitCallBack = (
  values: EmailSubmissionFormikValues,
  actions: FormikHelpers<EmailSubmissionFormikValues>
) => void;

/**
 * @description Function type for validating an email address.
 *
 * @param email string
 * @returns undefined if no error or error string
 */
export type ValidateEmailFunc = (email: string) => undefined | string;

/**
 * @description Props for an email submission form.
 */
export interface EmailSubmissionFormProps {
  /**
   * @description User supplied onSubmit callback function.
   *
   * Should be of type {@link EmailSubmissionFormOnSubmitCallBack}.
   */
  onSubmit: EmailSubmissionFormOnSubmitCallBack;

  /**
   * @description Optional email validation function supplied by the user.
   *
   * Should be of type {@link ValidateEmailFunc}.
   */
  validateEmail?: ValidateEmailFunc;

  /**
   * @description Optional help message that will be displayed under the email input box.
   *
   * Will render a {@link FormHelperText} component if present.
   */
  helpMessage?: string;

  /**
   * @description Display text on the submit button.
   */
  submitButtonText?: string;

  /**
   * @description Props for user-defined styles and component functionality.
   */
  styles?: {
    /**
     * @description Props for {@link Flex} component that will house the form's {@link Input} and {@link Button} components.
     *
     * @see {@link FlexProps} for supported properties.
     *
     * @see https://chakra-ui.com/docs/layout/flex for documentation on Flex component.
     */
    formFlexContainerProps?: FlexProps;

    /**
     * @description Props for {@link Input} component where user can enter their email.
     *
     * @see {@link InputProps} for supported properties.
     *
     * @see https://chakra-ui.com/docs/form/input for documentation on Input component.
     */
    inputProps?: InputProps;

    /**
     * @description Props for submit {@link Button} component.
     *
     * @see {@link ButtonProps} for supported properties.
     *
     * @see https://chakra-ui.com/docs/form/button for documentation on Button component.
     */
    submitButtonProps?: ButtonProps;

    /**
     * @description Props for {@link FormHelperText} component.
     *
     * @see {@link HTMLChakraProps} for supported properties.
     *
     * @see https://chakra-ui.com/docs/form/form-control for documentation.
     */
    helpMessageProps?: HTMLChakraProps<"div">;

    /**
     * @description Props for {@link FormErrorMessage} component.
     *
     * @see {@link FormErrorMessageProps} for supported properties.
     *
     * @see https://chakra-ui.com/docs/form/form-control for documentation.
     */
    errorMessageProps?: FormErrorMessageProps;
  };
}
