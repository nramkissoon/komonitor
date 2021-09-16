import {
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  InputGroup,
  InputLeftAddon,
  NumberInput,
  NumberInputField,
  Select,
  Tooltip,
} from "@chakra-ui/react";
import { Field, FieldInputProps, Form, Formik, FormikProps } from "formik";
import React from "react";
import { Alert, CoreUptimeMonitor } from "types";
import { minutesToString } from "../../../common/client-utils";
import { PLAN_PRODUCT_IDS } from "../../billing/plans";
import { createMonitor, updateMonitor } from "./../client";

interface CreateUpdateFormProps {
  product_id: string;
  currentMonitorAttributes?: CoreUptimeMonitor;
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

function createFrequencySelectOptions(productId: string) {
  return Object.getOwnPropertyNames(minutesToString).map((minutes) => (
    <option
      value={Number.parseInt(minutes)}
      key={minutesToString[Number.parseInt(minutes)]}
      disabled={
        Number.parseInt(minutes) === 1 && productId === PLAN_PRODUCT_IDS.FREE
      }
    >
      {minutesToString[Number.parseInt(minutes)]}
    </option>
  ));
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
  const { product_id, currentMonitorAttributes, userAlerts } = props;

  const createNewMonitor = currentMonitorAttributes === undefined;

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
    <Formik
      enableReinitialize
      initialValues={initialValues}
      onSubmit={async (values, actions) => {
        if (createNewMonitor) {
          await createMonitor(values);
        } else {
          await updateMonitor(values);
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
                <Select {...field} placeholder="Select Region">
                  <option value="us-east-1">us-east-1</option>
                </Select>
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
                <Select {...field} placeholder="Select Frequency">
                  {createFrequencySelectOptions(product_id)}
                </Select>
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
                isInvalid={form.errors.retries ? form.touched.retries : false}
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
                <FormErrorMessage>{form.errors.webhook_url}</FormErrorMessage>
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
                isInvalid={form.errors.alert_id ? form.touched.alert_id : false}
                mb="1.5em"
              >
                <FormLabel htmlFor="alert">Alert</FormLabel>
                <Select {...field} placeholder="Select Alert">
                  {createAlertSelectOptions(userAlerts ?? [])}
                </Select>
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
          <Button
            isLoading={props.isSubmitting}
            type="submit"
            size="lg"
            colorScheme="blue"
            color="white"
            bgGradient="linear(to-r, blue.300, blue.400)"
            shadow="md"
            fontSize="lg"
            fontWeight="medium"
          >
            {createNewMonitor ? "Create" : "Update"}
          </Button>
        </Form>
      )}
    </Formik>
  );
};
