import {
  Box,
  Button,
  Center,
  Container,
  FormControl,
  FormErrorMessage,
  FormHelperText,
  FormLabel,
  Heading,
  Input,
  Textarea,
  useColorModeValue,
  useToast,
} from "@chakra-ui/react";
import { Field, FieldInputProps, Form, Formik, FormikProps } from "formik";
import Router, { useRouter } from "next/router";
import { Alert, AlertSeverities, AlertStates, AlertTypes } from "project-types";
import React from "react";
import {
  MultiSelectTextInput,
  ReactSelectFormik,
} from "../../../common/components/React-Select-Formik";
import { getAlertRecipientLimitFromProductId } from "../../billing/plans";
import { createAlert, updateAlert } from "../client";

interface CreateUpdateFormProps {
  productId: string;
  currentAlertAttributes?: Alert;
}

type FormikFormProps = FormikProps<{
  name: string;
  description: string;
  severity: string;
  recipients: string[];
  state: string;
  type: string;
}>;

function alertTypeToRecipientHelpString(type: AlertTypes) {
  switch (type) {
    case "Email":
      return "email addresses";
    case "Slack":
      return "Slack channel ID's";
  }
}

function createSeveritySelectOptions() {
  const severities: AlertSeverities[] = ["Warning", "Severe", "Critical"];
  return severities.map((severity) => ({
    value: severity,
    label: severity,
    isDisabled: false,
  }));
}

function createAlertTypeSelectOptions(origType?: AlertTypes) {
  const types: AlertTypes[] = ["Email"];
  return types.map((type) => ({
    value: type,
    label: type,
    isDisabled: origType ? origType !== type : false,
  }));
}

function createAlertStateOptions() {
  const states: AlertStates[] = ["disabled", "enabled"];
  return states.map((state) => ({
    value: state,
    label: state.charAt(0).toUpperCase() + state.slice(1),
    isDisabled: false,
  }));
}

function validateName(name: string) {
  let error;
  if (!name) error = "Name is required.";
  else if (name.length > 50)
    error = "Name must be 50 characters or under in length.";
  else if (!/^[a-zA-Z0-9-_]+$/i.test(name))
    error =
      "Name must consist of alphanumeric characters, hyphens, and underscores.";
  return error;
}

function validateType(type: string) {
  if (!type) return "Type is required.";
}

function validateSeverity(severity: string) {
  if (!severity) return "Severity is required";
}

function validateState(state: string) {
  if (!state) return "State is required";
}

function validateDescription(description: string) {
  let error;
  if (!description) error = "Description is required.";
  else if (description.length > 300)
    error = "Description must be 300 characters or less.";
  return error;
}

function validateRecipients(recipients: string[]) {
  let error;
  if (recipients.length === 0) error = "At least 1 recipient is required.";
  return error;
}

export const CreateUpdateForm = (props: CreateUpdateFormProps) => {
  const router = useRouter();
  const errorToast = useToast();
  const postErrorToast = (message: string) =>
    errorToast({
      title: "Unable to perform action",
      description: message,
      status: "error",
      duration: 9000,
      isClosable: true,
      variant: "solid",
      position: "top",
    });

  let { productId, currentAlertAttributes } = props;

  const createNewAlert = currentAlertAttributes === undefined;

  const initialValues = {
    name: currentAlertAttributes?.name ?? "",
    description: currentAlertAttributes?.description ?? "",
    severity: currentAlertAttributes?.severity ?? "Warning",
    recipients: currentAlertAttributes?.recipients ?? [],
    state: currentAlertAttributes?.state ?? "enabled",
    type: currentAlertAttributes?.type ?? "Email",
  };

  return (
    <Container
      bg={useColorModeValue("white", "#0f131a")}
      borderRadius="xl"
      mb="3em"
      p="0"
      mt="2em"
      shadow="lg"
      maxW="3xl"
    >
      <Box
        bgGradient={useColorModeValue(
          "linear(to-b, blue.200, blue.100)",
          "linear(to-b, blue.200, blue.300)"
        )}
        w="100%"
        h="2em"
        borderTopRadius="lg"
        mb="1.5em"
      />
      <Box px="2em" pb="2em">
        <Heading textAlign="center" mb="1em" size="lg" fontWeight="medium">
          {createNewAlert ? "Create Alert" : "Edit Alert"}
        </Heading>
        <Formik
          enableReinitialize
          initialValues={initialValues}
          onSubmit={async (values, actions) => {
            if (createNewAlert) {
              await createAlert(
                values,
                () =>
                  Router.push({
                    pathname: "/app/alerts",
                    query: { newAlertCreated: "true" },
                  }),
                postErrorToast
              );
            } else {
              const augmentedValues = {
                ...currentAlertAttributes,
                ...values,
              } as Alert;
              await updateAlert(
                augmentedValues,
                () => {
                  Router.push({
                    pathname: "/app/alerts/" + augmentedValues.alert_id,
                    query: { alertUpdated: "true" },
                  });
                },
                postErrorToast
              );
            }
            actions.setSubmitting(false);
          }}
        >
          {(props) => (
            <Form>
              <Field name="name" validate={validateName}>
                {({
                  field,
                  form,
                }: {
                  field: FieldInputProps<string>;
                  form: FormikFormProps;
                }) => (
                  <FormControl
                    isInvalid={form.errors.name ? form.touched.name : false}
                    isRequired
                    mb="1.5em"
                  >
                    <FormLabel htmlFor="name">Alert Name</FormLabel>
                    <Input {...field} id="name" placeholder="Alert Name" />
                    <FormErrorMessage>{form.errors.name}</FormErrorMessage>
                  </FormControl>
                )}
              </Field>
              <Field name="type" validate={validateType}>
                {({
                  field,
                  form,
                }: {
                  field: FieldInputProps<string>;
                  form: FormikFormProps;
                }) => (
                  <FormControl
                    isInvalid={form.errors.type ? form.touched.type : false}
                    isRequired
                    mb="1.5em"
                    isDisabled={!createNewAlert} // disable when updating alert.
                  >
                    <FormLabel htmlFor="type">Alert Type</FormLabel>
                    <ReactSelectFormik
                      options={createAlertTypeSelectOptions(
                        !createAlert ? initialValues.type : undefined
                      )}
                      placeholder="Alert type"
                      field={
                        !createNewAlert
                          ? { ...field, value: initialValues.type }
                          : field
                      }
                      form={form}
                    />
                    {!createNewAlert && (
                      <FormHelperText>
                        Alert types are not editable.
                      </FormHelperText>
                    )}
                    <FormErrorMessage>{form.errors.type}</FormErrorMessage>
                  </FormControl>
                )}
              </Field>
              <Field name="severity" validate={validateSeverity}>
                {({
                  field,
                  form,
                }: {
                  field: FieldInputProps<string>;
                  form: FormikFormProps;
                }) => (
                  <FormControl
                    isInvalid={
                      form.errors.severity ? form.touched.severity : false
                    }
                    isRequired
                    mb="1.5em"
                  >
                    <FormLabel htmlFor="severity">Severity</FormLabel>
                    <ReactSelectFormik
                      options={createSeveritySelectOptions()}
                      placeholder="Alert severity"
                      field={field}
                      form={form}
                    />
                    <FormErrorMessage>{form.errors.type}</FormErrorMessage>
                  </FormControl>
                )}
              </Field>
              <Field name="description" validate={validateDescription}>
                {({
                  field,
                  form,
                }: {
                  field: FieldInputProps<string>;
                  form: FormikFormProps;
                }) => (
                  <FormControl
                    isInvalid={
                      form.errors.description ? form.touched.description : false
                    }
                    isRequired
                    mb="1.5em"
                  >
                    <FormLabel htmlFor="description">Description</FormLabel>
                    <Textarea
                      {...field}
                      id="description"
                      placeholder="Alert Description"
                    />
                    <FormHelperText>
                      Descriptions appear in the alert when they are sent. You
                      should put useful information about the alert and/or
                      incident action items here.
                    </FormHelperText>
                    <FormErrorMessage>
                      {form.errors.description}
                    </FormErrorMessage>
                  </FormControl>
                )}
              </Field>
              <Field
                name="recipients"
                validate={validateRecipients}
                isMulti={true}
              >
                {({
                  field,
                  form,
                }: {
                  field: FieldInputProps<string[]>;
                  form: FormikFormProps;
                }) => (
                  <FormControl
                    isInvalid={
                      form.errors.recipients ? form.touched.recipients : false
                    }
                    isRequired
                    mb="1.5em"
                  >
                    <FormLabel htmlFor="recipients">Recipients</FormLabel>
                    <MultiSelectTextInput
                      placeholder="Recipients"
                      field={field}
                      form={form}
                      initialValue={form.initialValues.recipients}
                      selectLimit={getAlertRecipientLimitFromProductId(
                        productId
                      )}
                      postErrorToast={postErrorToast}
                    />
                    <FormHelperText>
                      Recipients should be{" "}
                      {alertTypeToRecipientHelpString(
                        form.values.type as AlertTypes
                      )}
                      .
                    </FormHelperText>
                    <FormErrorMessage>
                      {form.errors.recipients}
                    </FormErrorMessage>
                  </FormControl>
                )}
              </Field>
              <Field name="state" validate={validateState}>
                {({
                  field,
                  form,
                }: {
                  field: FieldInputProps<string>;
                  form: FormikFormProps;
                }) => (
                  <FormControl
                    isInvalid={form.errors.state ? form.touched.state : false}
                    isRequired
                    mb="1.5em"
                    isDisabled={createNewAlert}
                  >
                    <FormLabel htmlFor="state">State</FormLabel>
                    <ReactSelectFormik
                      options={createAlertStateOptions()}
                      placeholder="Alert state"
                      field={field}
                      form={form}
                      isDisabled={createNewAlert}
                    />
                    {createNewAlert && (
                      <FormHelperText>
                        Alert state is set to default "enabled" on creation.
                      </FormHelperText>
                    )}
                    {!createNewAlert && form.values.state === "disabled" && (
                      <FormHelperText textColor="yellow.500">
                        Disabled alerts will not send messaged to any
                        recipients.
                      </FormHelperText>
                    )}
                    <FormErrorMessage>{form.errors.state}</FormErrorMessage>
                  </FormControl>
                )}
              </Field>
              <Center>
                <Button
                  size="lg"
                  colorScheme="gray"
                  bg="gray.400"
                  color="white"
                  shadow="md"
                  fontSize="lg"
                  fontWeight="medium"
                  onClick={() => router.back()}
                  _hover={{ bg: "gray.500" }}
                  mr="1.4em"
                >
                  Cancel
                </Button>
                <Button
                  isLoading={props.isSubmitting}
                  type="submit"
                  size="lg"
                  colorScheme="blue"
                  color="white"
                  bg="blue.400"
                  shadow="md"
                  fontSize="lg"
                  fontWeight="medium"
                  _hover={{ bg: "blue.600" }}
                >
                  {createNewAlert ? "Create" : "Update"}
                </Button>
              </Center>
            </Form>
          )}
        </Formik>
      </Box>
    </Container>
  );
};
