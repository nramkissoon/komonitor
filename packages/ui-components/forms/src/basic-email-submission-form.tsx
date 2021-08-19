import React from "react";
import {
  Input,
  Button,
  FormControl,
  FormErrorMessage,
  Flex,
  FlexProps,
  FormHelperText,
  InputProps,
  ButtonProps,
  HTMLChakraProps,
  FormErrorMessageProps,
} from "@chakra-ui/react";
import { EmailSubmissionFormikValues, EmailSubmissionFormProps } from "./forms";
import { Formik, Form, Field, FieldInputProps, FormikProps } from "formik";
import { overrideStyles } from "@hyper-next/react-utils";
import { basicValidateEmailSubmission } from "./validation-utils";

/**
 * @description A simple form that renders an email input text box and submit button.
 *
 * Using this component requires an onSubmit function to be passed into the props.
 * @see {@link EmailSubmissionFormOnSubmitCallBack} for callback documentation.
 *
 * @param props {@link EmailSubmissionFormProps}
 * @returns an {@link EmailSubmissionForm} component
 */
export const BasicEmailSubmissionForm = (props: EmailSubmissionFormProps) => {
  const { onSubmit, validateEmail, helpMessage, submitButtonText, styles } =
    props;

  const defaultFormFlexContainerStyles: FlexProps = {
    w: "100%",
    display: "flex",
    flexDirection: "row",
    alignItems: "flex-start",
  };

  const defaultInputStyles: InputProps = {
    size: "lg",
    shadow: "md",
  };

  const defaultSubmitButtonStyles: ButtonProps = {
    size: "lg",
    ml: ".8em",
    px: ["1.5em", "2em"],
    shadow: "md",
  };

  const defaultHelpMessageStyles: HTMLChakraProps<"div"> = {};

  const defaultErrorMessageStyles: FormErrorMessageProps = {};

  return (
    <Formik initialValues={{ email: "" }} onSubmit={onSubmit}>
      {(props) => (
        <Form>
          <Flex
            {...overrideStyles(
              defaultFormFlexContainerStyles,
              styles?.formFlexContainerProps
            )}
          >
            <Field
              name="email"
              validate={
                validateEmail ? validateEmail : basicValidateEmailSubmission
              }
            >
              {({
                field,
                form,
              }: {
                field: FieldInputProps<string>;
                form: FormikProps<EmailSubmissionFormikValues>;
              }) => (
                <FormControl
                  isInvalid={form.errors.email ? form.touched.email : false}
                >
                  <Input
                    {...field}
                    id="email"
                    placeholder="Email"
                    {...overrideStyles(defaultInputStyles, styles?.inputProps)}
                  ></Input>
                  <FormErrorMessage
                    {...overrideStyles(
                      defaultErrorMessageStyles,
                      styles?.errorMessageProps
                    )}
                  >
                    {form.errors.email}
                  </FormErrorMessage>
                  {helpMessage ? (
                    <FormHelperText
                      {...overrideStyles(
                        defaultHelpMessageStyles,
                        styles?.helpMessageProps
                      )}
                    >
                      {helpMessage}
                    </FormHelperText>
                  ) : (
                    <></>
                  )}
                </FormControl>
              )}
            </Field>
            <Button
              isLoading={props.isSubmitting}
              type="submit"
              {...overrideStyles(
                defaultSubmitButtonStyles,
                styles?.submitButtonProps
              )}
            >
              {submitButtonText ? submitButtonText : "Submit"}
            </Button>
          </Flex>
        </Form>
      )}
    </Formik>
  );
};
