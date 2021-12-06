import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  Button,
  chakra,
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
import Router, { useRouter } from "next/router";
import { Alert, UptimeMonitor } from "project-types";
import React from "react";
import {
  Controller,
  SubmitHandler,
  useFieldArray,
  useForm,
} from "react-hook-form";
import { useSWRConfig } from "swr";
import {
  minutesToString,
  regionToLocationStringMap,
} from "../../../common/client-utils";
import { ReactSelect } from "../../../common/components/React-Select";
import { PLAN_PRODUCT_IDS } from "../../billing/plans";
import { createMonitor, updateMonitor } from "../client";
import { HttpHeaderFormField } from "./Http-Header-Form-Field";

interface CreateUpdateFormProps {
  product_id: string;
  currentMonitorAttributes?: UptimeMonitor;
  userAlerts?: Alert[];
}

export type Inputs = {
  url: string;
  name: string;
  region: string;
  frequency: string;
  failures_before_alert: number;
  webhook_url: string;
  alert_id: string;
  http_headers: {
    header: string;
    value: string;
  }[];
};

// Used to prefill fields with current monitor attributes
function createFormPlaceholdersFromMonitor(monitor: UptimeMonitor | undefined) {
  if (!monitor) return undefined;
  let http_headers;
  if (monitor.http_headers) {
    http_headers = Object.keys(monitor.http_headers).map((header) => ({
      header: header,
      value: monitor.http_headers ? monitor.http_headers[header] : "",
    }));
  }
  const placeholders: any = { ...monitor };
  if (placeholders.webhook_url)
    placeholders.webhook_url = placeholders.webhook_url.replace("https://", "");
  placeholders.url = placeholders.url.replace("https://", "");
  placeholders.frequency = placeholders.frequency.toString();
  placeholders.http_headers = http_headers;
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
  return Object.keys(regionToLocationStringMap).map((region) => ({
    value: region,
    label: regionToLocationStringMap[region],
    isDisabled: false,
  }));
}

export const CreateUpdateFormRewrite = (props: CreateUpdateFormProps) => {
  let { product_id, currentMonitorAttributes, userAlerts } = props;

  const createNewMonitor = currentMonitorAttributes === undefined;
  const { mutate } = useSWRConfig();
  const router = useRouter();
  const errorToast = useToast();
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting, touchedFields },
    control,
    setValue,
  } = useForm<Inputs>({
    defaultValues: createNewMonitor
      ? undefined
      : (createFormPlaceholdersFromMonitor(
          currentMonitorAttributes
        ) as unknown as Inputs),
  });
  const { fields, append, remove } = useFieldArray({
    control,
    name: "http_headers",
  });

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

  const freqSelectFieldOptions =
    createFrequencySelectOptionsReactSelect(product_id);

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    if (createNewMonitor) {
      await createMonitor(
        data,
        () =>
          Router.push({
            pathname: "/app/uptime",
            query: { newMonitorCreated: "true" },
          }),
        postErrorToast
      );
    } else {
      // augment the form values by merging the current monitor's attributes.
      const augmentedValues: any = data;
      augmentedValues.monitor_id = currentMonitorAttributes?.monitor_id;
      augmentedValues.owner_id = currentMonitorAttributes?.owner_id;
      augmentedValues.created_at = currentMonitorAttributes?.created_at;
      augmentedValues.last_updated = currentMonitorAttributes?.last_updated;
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
    mutate("/api/uptime/monitors", null, true);
  };
  return (
    <>
      <Heading
        textAlign="center"
        mt="1em"
        mb="1em"
        size="lg"
        fontWeight="medium"
      >
        {createNewMonitor ? "Create Uptime Monitor" : "Edit Monitor"}
      </Heading>
      <Container borderRadius="xl" mb="3em" p="0" maxW="6xl">
        <chakra.form onSubmit={handleSubmit(onSubmit)}>
          <Box
            p="2em"
            borderRadius="xl"
            shadow="lg"
            bg={useColorModeValue("white", "#0f131a")}
            mb="1.5em"
          >
            <Heading size="md" mb="15px">
              Monitor Settings
            </Heading>
            <Controller
              name="name"
              defaultValue=""
              control={control}
              rules={{
                required: "Monitor name is required.",
                maxLength: {
                  value: 50,
                  message: "Name must be 50 characters or under in length.",
                },
                pattern: {
                  value: /^[a-zA-Z0-9-_]+$/i,
                  message:
                    "Name must consist of alphanumeric characters, hyphens, and underscores.",
                },
              }}
              render={({ field }) => (
                <FormControl
                  isInvalid={errors.name ? touchedFields.name : false}
                  isRequired
                  mb="1.5em"
                >
                  <FormLabel htmlFor="name">Monitor Name</FormLabel>
                  <Input {...field} id="name" placeholder="Monitor Name" />
                  <FormErrorMessage>{errors.name?.message}</FormErrorMessage>
                </FormControl>
              )}
            />
            <Controller
              name="url"
              defaultValue=""
              control={control}
              rules={{
                required: "URL is required.",
                maxLength: {
                  value: 250,
                  message: "URL must be 250 characters or under in length.",
                },
              }}
              render={({ field }) => (
                <FormControl
                  isInvalid={errors.url ? touchedFields.url : false}
                  isRequired
                  mb="1.5em"
                >
                  <FormLabel htmlFor="url">URL</FormLabel>
                  <InputGroup id="url">
                    <InputLeftAddon children="https://" />
                    <Input {...field} placeholder="your-website.com" />
                  </InputGroup>
                  <FormErrorMessage>{errors.url?.message}</FormErrorMessage>
                </FormControl>
              )}
            />
            <Controller
              name="region"
              defaultValue=""
              control={control}
              rules={{
                required: "Region is required.",
              }}
              render={({ field }) => (
                <FormControl
                  isInvalid={errors.region ? touchedFields.region : false}
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
                  <ReactSelect
                    options={createRegionSelectOptions()}
                    placeholder="Select Region"
                    field={field as any}
                    setValue={setValue}
                  />
                  <FormErrorMessage>{errors.region?.message}</FormErrorMessage>
                </FormControl>
              )}
            />
            <Controller
              name="frequency"
              defaultValue=""
              control={control}
              rules={{
                required: "Frequency is required.",
              }}
              render={({ field }) => (
                <FormControl
                  isInvalid={errors.frequency ? touchedFields.frequency : false}
                  isRequired
                  mb=".5em"
                >
                  <FormLabel htmlFor="region">
                    <Tooltip
                      placement="right-end"
                      label="Frequency at which the monitor runs an uptime check."
                      openDelay={500}
                    >
                      Check Frequency
                    </Tooltip>
                  </FormLabel>
                  <ReactSelect
                    options={freqSelectFieldOptions}
                    placeholder="Select Frequency"
                    field={field as any}
                    setValue={setValue}
                  />
                  <FormErrorMessage>
                    {errors.frequency?.message}
                  </FormErrorMessage>
                </FormControl>
              )}
            />
          </Box>
          <Box
            p="2em"
            borderRadius="xl"
            shadow="lg"
            mb="1.5em"
            bg={useColorModeValue("white", "#0f131a")}
          >
            <Heading size="md" mb="15px">
              Alert Settings
            </Heading>
            <Controller
              name="alert_id"
              control={control}
              defaultValue=""
              render={({ field }) => (
                <FormControl
                  isInvalid={errors.alert_id ? touchedFields.alert_id : false}
                  mb="1.5em"
                >
                  <FormLabel htmlFor="alert">Alert</FormLabel>
                  <ReactSelect
                    options={createAlertSelectOptionsReactSelect(
                      userAlerts ?? []
                    )}
                    placeholder="Select Alert"
                    field={field as any}
                    setValue={setValue}
                  />
                  <FormErrorMessage>
                    {errors.alert_id?.message}
                  </FormErrorMessage>
                </FormControl>
              )}
            />
            <Controller
              name="failures_before_alert"
              control={control}
              defaultValue={1}
              rules={{
                max: {
                  value: 5,
                  message:
                    "Number of failures must be between 1 and 5 inclusive.",
                },
                min: {
                  value: 1,
                  message:
                    "Number of failures must be between 1 and 5 inclusive.",
                },
              }}
              render={({ field }) => (
                <FormControl
                  isInvalid={
                    errors.failures_before_alert
                      ? touchedFields.failures_before_alert
                      : false
                  }
                  isRequired
                  isDisabled={!watch("alert_id")}
                  mb=".5em"
                >
                  <FormLabel htmlFor="failuresBeforeRetry">
                    <Tooltip
                      placement="right-end"
                      label="Number of failed uptime checks before an alert is sent."
                      openDelay={500}
                    >
                      {!watch("alert_id")
                        ? "Failures Before Alert (Select an Alert to edit)"
                        : "Failures Before Alert"}
                    </Tooltip>
                  </FormLabel>
                  <NumberInput
                    min={1}
                    step={1}
                    max={5}
                    clampValueOnBlur={false}
                    value={watch("alert_id") ? field.value : ""}
                  >
                    <NumberInputField
                      {...field}
                      placeholder="Failure amount"
                      value={watch("alert_id") ? field.value : ""}
                    />
                  </NumberInput>
                  <FormErrorMessage>
                    {errors.failures_before_alert?.message}
                  </FormErrorMessage>
                </FormControl>
              )}
            />
          </Box>
          <Box
            p="2em"
            borderRadius="xl"
            shadow="lg"
            mb="1.5em"
            bg={useColorModeValue("white", "#0f131a")}
          >
            <Accordion allowToggle>
              <AccordionItem border="none">
                <AccordionButton
                  borderRadius="md"
                  _hover={{ bgColor: useColorModeValue("blue.50", "blue.500") }}
                >
                  <Heading size="md">Advanced Settings</Heading>
                  <AccordionIcon boxSize="8" />
                </AccordionButton>
                <AccordionPanel pb={4}>
                  <Controller
                    name="webhook_url"
                    control={control}
                    rules={{
                      maxLength: {
                        value: 250,
                        message:
                          "URL must be 250 characters or under in length",
                      },
                    }}
                    render={({ field }) => (
                      <FormControl
                        isInvalid={
                          errors.webhook_url ? touchedFields.webhook_url : false
                        }
                        isDisabled={product_id === PLAN_PRODUCT_IDS.FREE}
                        mb="1.5em"
                      >
                        <FormLabel htmlFor="webhookUrl">Webhook URL</FormLabel>
                        <InputGroup id="webhookUrl">
                          <InputLeftAddon children="https://" />
                          <Input
                            {...field}
                            placeholder="your-webhook-url.com"
                          />
                        </InputGroup>
                        <FormErrorMessage>
                          {errors.webhook_url?.message}
                        </FormErrorMessage>
                      </FormControl>
                    )}
                  />
                  <HttpHeaderFormField
                    {...{
                      fields,
                      append,
                      remove,
                      control,
                      errors,
                      touchedFields,
                      productId: product_id,
                    }}
                  />
                </AccordionPanel>
              </AccordionItem>
            </Accordion>
          </Box>
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
            isLoading={isSubmitting}
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
        </chakra.form>
      </Container>
    </>
  );
};
