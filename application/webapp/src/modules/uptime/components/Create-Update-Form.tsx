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
  InputGroup,
  InputLeftAddon,
  NumberInput,
  NumberInputField,
  Tooltip,
  useColorModeValue,
  useToast,
} from "@chakra-ui/react";
import { Field, FieldInputProps, Form, Formik, FormikProps } from "formik";
import Router, { useRouter } from "next/router";
import React from "react";
import { Alert, UptimeMonitor } from "types";
import { minutesToString } from "../../../common/client-utils";
import { ReactSelectFormik } from "../../../common/components/React-Select-Formik";
import { PLAN_PRODUCT_IDS } from "../../billing/plans";
import { createMonitor, updateMonitor } from "./../client";

interface CreateUpdateFormProps {
  product_id: string;
  currentMonitorAttributes?: UptimeMonitor;
  userAlerts?: Alert[];
}

type FormikFormProps = FormikProps<{
  url: string;
  name: string;
  region: string;
  frequency: number;
  retries: number;
  failures_before_alert?: number;
  webhook_url?: string;
  alert_id?: string;
}>;

function getAlertNameFromList(alerts: Alert[] | undefined, id: string) {
  if (!alerts) return "";
  let name = "";
  for (let alert of alerts) {
    if (alert.alert_id === id) {
      name = alert.name;
    }
  }
  return name;
}

function createAlertSelectOptions(alerts: Alert[]) {
  if (!alerts || alerts.length === 0) return <></>;
  else {
    return alerts.map((alert) => (
      <option key={alert.alert_id} value={alert.alert_id}>
        {alert.name}
      </option>
    ));
  }
}

// Used to prefill fields with current monitor attributes
function createFormPlaceholdersFromMonitor(monitor: UptimeMonitor | undefined) {
  if (!monitor) return undefined;
  const placeholders = { ...monitor };
  if (placeholders.webhook_url)
    placeholders.webhook_url = placeholders.webhook_url.replace("https://", "");
  placeholders.url = placeholders.url.replace("https://", "");
  return placeholders;
}

function createAlertSelectOptionsReactSelect(alerts: Alert[]) {
  if (!alerts || alerts.length === 0) return [];
  return alerts.map((alert) => ({
    value: alert.alert_id,
    label: alert.name,
    isDisabled: false,
  }));
}

function createFrequencySelectOptionsReactSelect(productId: string) {
  return Object.getOwnPropertyNames(minutesToString).map((minutes) => ({
    value: Number.parseInt(minutes).toString(),
    label: minutesToString[Number.parseInt(minutes)],
    isDisabled: productId === PLAN_PRODUCT_IDS.FREE && minutes === "1",
  }));
}

function createRegionSelectOptions() {
  return [
    {
      value: "us-east-1",
      label: "us-east-1",
      isDisabled: false,
    },
  ];
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
function validateUrl(url: string) {
  let error;
  if (!url) error = "URL is required.";
  else if (url.length > 250)
    error = "URL must be 250 characters or under in length";
  return error;
}
function validateRegion(region: string) {
  let error;
  if (!region) error = "Region is required.";
  if (!["us-east-1"].includes(region)) error = "Invalid Region";
  return error;
}
function validateFrequency(freq: string) {
  let error;
  if (!freq) error = "Frequency is required.";
  return error;
}
function validateRetries(retries: string) {
  let error;
  const retriesAsNum = Number.parseInt(retries);
  if (!retries) error = "Retry amount is required.";
  else if (!(retriesAsNum >= 0 && retriesAsNum <= 5))
    error = "Retry amount must be between 0 and 5 inclusive.";
  return error;
}
function validateFailuresBeforeAlert(failures: string) {
  let error;
  let failuresAsNum = Number.parseInt(failures);
  if (!(failuresAsNum >= 1 && failuresAsNum <= 5) && failuresAsNum)
    error = "Number of failures must be between 1 and 5 inclusive.";
  return error;
}
function validateWebhookUrl(webhookUrl: string) {
  let error;
  if (webhookUrl.length > 250)
    error = "URL must be 250 characters or under in length";
  return error;
}
function validateAlertId() {}

export const CreateUpdateForm = (props: CreateUpdateFormProps) => {
  const router = useRouter();
  const errorToast = useToast();
  const postErrorToast = (message: string) =>
    errorToast({
      title: "Unable to create monitor.",
      description: message,
      status: "error",
      duration: 9000,
      isClosable: true,
      variant: "solid",
      position: "top",
    });

  let { product_id, currentMonitorAttributes, userAlerts } = props;

  const createNewMonitor = currentMonitorAttributes === undefined;
  currentMonitorAttributes = createFormPlaceholdersFromMonitor(
    currentMonitorAttributes
  );

  const freqSelectFieldOptions =
    createFrequencySelectOptionsReactSelect(product_id);

  const initialValues = {
    url: currentMonitorAttributes?.url ? currentMonitorAttributes.url : "",
    name: currentMonitorAttributes?.name ? currentMonitorAttributes.name : "",
    region: currentMonitorAttributes?.region
      ? currentMonitorAttributes.region
      : "us-east-1",
    frequency: currentMonitorAttributes?.frequency
      ? currentMonitorAttributes.frequency.toString()
      : "5",
    retries: currentMonitorAttributes?.retries
      ? currentMonitorAttributes.retries.toString()
      : "0",
    failures_before_alert: currentMonitorAttributes?.failures_before_alert
      ? currentMonitorAttributes.failures_before_alert.toString()
      : "",
    webhook: currentMonitorAttributes?.webhook_url
      ? currentMonitorAttributes.webhook_url
      : "",
    alert: currentMonitorAttributes?.alert_id
      ? getAlertNameFromList(userAlerts, currentMonitorAttributes.alert_id)
      : "",
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
          {createNewMonitor ? "Create Uptime Monitor" : "Edit Monitor"}
        </Heading>
        <Formik
          enableReinitialize
          initialValues={initialValues}
          onSubmit={async (values, actions) => {
            if (createNewMonitor) {
              await createMonitor(
                values,
                () =>
                  Router.push({
                    pathname: "/app/uptime",
                    query: { newMonitorCreated: "true" },
                  }),
                postErrorToast
              );
            } else {
              // augment the form values by merging the current monitor's attributes.
              const augmentedValues: any = values;
              augmentedValues.monitor_id = currentMonitorAttributes?.monitor_id;
              augmentedValues.owner_id = currentMonitorAttributes?.owner_id;
              augmentedValues.created_at = currentMonitorAttributes?.created_at;
              augmentedValues.last_updated =
                currentMonitorAttributes?.last_updated;
              await updateMonitor(
                augmentedValues,
                () => {
                  Router.push({
                    pathname: "/app/uptime/" + augmentedValues.monitor_id,
                    query: { monitorUpdated: "true" },
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
                    <FormLabel htmlFor="name">Monitor Name</FormLabel>
                    <Input {...field} id="name" placeholder="Monitor Name" />
                    <FormErrorMessage>{form.errors.name}</FormErrorMessage>
                  </FormControl>
                )}
              </Field>
              <Field name="url" validate={validateUrl}>
                {({
                  field,
                  form,
                }: {
                  field: FieldInputProps<string>;
                  form: FormikFormProps;
                }) => (
                  <FormControl
                    isInvalid={form.errors.url ? form.touched.url : false}
                    isRequired
                    mb="1.5em"
                  >
                    <FormLabel htmlFor="url">URL</FormLabel>
                    <InputGroup id="url">
                      <InputLeftAddon children="https://" />
                      <Input {...field} placeholder="your-website.com" />
                    </InputGroup>
                    <FormErrorMessage>{form.errors.url}</FormErrorMessage>
                  </FormControl>
                )}
              </Field>
              <Field name="region" validate={validateRegion}>
                {({
                  field,
                  form,
                }: {
                  field: FieldInputProps<string>;
                  form: FormikFormProps;
                }) => (
                  <FormControl
                    isInvalid={form.errors.region ? form.touched.region : false}
                    isRequired
                    mb="1.5em"
                  >
                    <FormLabel htmlFor="region">
                      <Tooltip
                        placement="right-end"
                        label="AWS Region to run this monitor from."
                        openDelay={500}
                      >
                        Region
                      </Tooltip>
                    </FormLabel>
                    <ReactSelectFormik
                      options={createRegionSelectOptions()}
                      placeholder="Select Region"
                      field={field}
                      form={form}
                    />
                    <FormErrorMessage>{form.errors.region}</FormErrorMessage>
                  </FormControl>
                )}
              </Field>
              <Field name="frequency" validate={validateFrequency}>
                {({
                  field,
                  form,
                }: {
                  field: FieldInputProps<string>;
                  form: FormikFormProps;
                }) => (
                  <FormControl
                    isInvalid={
                      form.errors.frequency ? form.touched.frequency : false
                    }
                    isRequired
                    mb="1.5em"
                  >
                    <FormLabel htmlFor="frequency">
                      <Tooltip
                        placement="right-end"
                        label="Frequency at which the monitor runs an uptime check."
                        openDelay={500}
                      >
                        Check Frequency
                      </Tooltip>
                    </FormLabel>
                    <ReactSelectFormik
                      options={freqSelectFieldOptions}
                      placeholder="Select Frequency"
                      field={field}
                      form={form}
                    />
                    <FormErrorMessage>{form.errors.frequency}</FormErrorMessage>
                  </FormControl>
                )}
              </Field>
              <Field name="retries" validate={validateRetries}>
                {({
                  field,
                  form,
                }: {
                  field: FieldInputProps<string>;
                  form: FormikFormProps;
                }) => (
                  <FormControl
                    isInvalid={
                      form.errors.retries ? form.touched.retries : false
                    }
                    isRequired
                    mb="1.5em"
                  >
                    <FormLabel htmlFor="retries">
                      <Tooltip
                        placement="right-end"
                        label="Number of retries before an uptime check is considered a failure."
                        openDelay={500}
                      >
                        Retry Checks
                      </Tooltip>
                    </FormLabel>
                    <NumberInput
                      min={0}
                      step={1}
                      max={product_id === PLAN_PRODUCT_IDS.FREE ? 1 : 5}
                      clampValueOnBlur={false}
                      value={field.value}
                    >
                      <NumberInputField
                        {...field}
                        placeholder="Retry amount"
                        value={field.value}
                      />
                    </NumberInput>
                    <FormErrorMessage>{form.errors.retries}</FormErrorMessage>
                  </FormControl>
                )}
              </Field>
              <Field name="webhook" validate={validateWebhookUrl}>
                {({
                  field,
                  form,
                }: {
                  field: FieldInputProps<string>;
                  form: FormikFormProps;
                }) => (
                  <FormControl
                    isInvalid={
                      form.errors.webhook_url ? form.touched.webhook_url : false
                    }
                    isDisabled={product_id === PLAN_PRODUCT_IDS.FREE}
                    mb="1.5em"
                  >
                    <FormLabel htmlFor="webhookUrl">Webhook URL</FormLabel>
                    <InputGroup id="webhookUrl">
                      <InputLeftAddon children="https://" />
                      <Input {...field} placeholder="your-webhook-url.com" />
                    </InputGroup>
                    <FormErrorMessage>
                      {form.errors.webhook_url}
                    </FormErrorMessage>
                  </FormControl>
                )}
              </Field>
              <Field name="alert" validate={validateAlertId}>
                {({
                  field,
                  form,
                }: {
                  field: FieldInputProps<string>;
                  form: FormikFormProps;
                }) => (
                  <FormControl
                    isInvalid={
                      form.errors.alert_id ? form.touched.alert_id : false
                    }
                    mb="1.5em"
                  >
                    <FormLabel htmlFor="alert">Alert</FormLabel>
                    <ReactSelectFormik
                      options={createAlertSelectOptionsReactSelect(
                        userAlerts ?? []
                      )}
                      placeholder={"Select Alert"}
                      field={field}
                      form={form}
                    />
                    <FormErrorMessage>{form.errors.alert_id}</FormErrorMessage>
                  </FormControl>
                )}
              </Field>
              <Field
                name="failures_before_alert"
                validate={validateFailuresBeforeAlert}
              >
                {({
                  field,
                  form,
                }: {
                  field: FieldInputProps<string>;
                  form: FormikFormProps;
                }) => (
                  <FormControl
                    isInvalid={
                      form.errors.failures_before_alert
                        ? form.touched.failures_before_alert
                        : false
                    }
                    isRequired
                    isDisabled={!props.values.alert}
                    mb="1.5em"
                  >
                    <FormLabel htmlFor="failuresBeforeRetry">
                      <Tooltip
                        placement="right-end"
                        label="Number of failed uptime checks before an alert is sent."
                        openDelay={500}
                      >
                        {!props.values.alert
                          ? "Failures Before Alert (Select an Alert to edit)"
                          : "Failures Before Alert"}
                      </Tooltip>
                    </FormLabel>
                    <NumberInput
                      min={0}
                      step={1}
                      max={5}
                      clampValueOnBlur={false}
                      value={field.value}
                    >
                      <NumberInputField
                        {...field}
                        placeholder="Failure amount"
                        value={field.value}
                      />
                    </NumberInput>
                    <FormErrorMessage>
                      {form.errors.failures_before_alert}
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
                  {createNewMonitor ? "Create" : "Update"}
                </Button>
              </Center>
            </Form>
          )}
        </Formik>
      </Box>
    </Container>
  );
};
