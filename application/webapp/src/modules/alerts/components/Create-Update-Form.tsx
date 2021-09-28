import {
  Box,
  Button,
  Center,
  Container,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Heading,
  Input,
  Textarea,
  useColorModeValue,
  useToast,
} from "@chakra-ui/react";
import { Field, FieldInputProps, Form, Formik, FormikProps } from "formik";
import { useRouter } from "next/router";
import { Alert, AlertSeverities } from "project-types";
import React from "react";
import { MultiSelectTextInput } from "../../../common/components/React-Select-Formik";
import { getAlertRecipientLimitFromProductId } from "../../billing/plans";

interface CreateUpdateFormProps {
  productId: string;
  currentAlertAttributes?: Alert;
}

type FormikFormProps = FormikProps<{
  name: string;
  description: string;
  severity: string;
  recipients: string[];
  status: string;
  type: string;
}>;

function createSeveritySelectOptions() {
  const severities: AlertSeverities[] = ["Warning", "Severe", "Critical"];
  return severities.map((severity) => ({
    value: severity,
    label: severity,
    isDisabled: false,
  }));
}

function createAlertTypeSelectOptions() {}

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

function validateDescription(description: string) {}

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
    severity: currentAlertAttributes?.severity ?? "",
    recipients: currentAlertAttributes?.recipients ?? [],
    status: currentAlertAttributes?.status ?? "on",
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
          onSubmit={(values, actions) => {
            console.log(values);
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
                    <FormLabel htmlFor="description">
                      Alert Description
                    </FormLabel>
                    <Textarea
                      {...field}
                      id="description"
                      placeholder="Alert Description"
                    />
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
                    <FormLabel htmlFor="recipients">Alert Recipients</FormLabel>
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
                    <FormErrorMessage>
                      {form.errors.recipients}
                    </FormErrorMessage>
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
