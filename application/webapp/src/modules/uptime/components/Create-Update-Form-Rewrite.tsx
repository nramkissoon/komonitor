import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  Button,
  chakra,
  Checkbox,
  Container,
  Flex,
  FormControl,
  FormErrorMessage,
  FormHelperText,
  FormLabel,
  Heading,
  Input,
  InputGroup,
  InputLeftAddon,
  NumberInput,
  NumberInputField,
  Switch,
  Textarea,
  Tooltip,
  useColorModeValue,
  useToast,
} from "@chakra-ui/react";
import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";
import {
  Controller,
  FormProvider,
  SubmitHandler,
  useFieldArray,
  useForm,
} from "react-hook-form";
import {
  Alert,
  ChannelType,
  HttpMethods,
  UpConditionCheck,
  UptimeMonitor,
} from "utils";
import {
  minutesToString,
  regionToLocationStringMap,
} from "../../../common/client-utils";
import { ReactSelect } from "../../../common/components/React-Select";
import { PLAN_PRODUCT_IDS } from "../../billing/plans";
import {
  createMonitor,
  updateMonitor,
  useUptimeMonitorsForProject,
} from "../client";
import { HttpHeaderFormField } from "./Http-Header-Form-Field";
import { RecipientFormController } from "./Recipient-Form-Controller";
import { UpConditionCheckFields } from "./Up-Condition-Check-Fields";

interface CreateUpdateFormProps {
  product_id: string;
  currentMonitorAttributes?: UptimeMonitor;
  closeForm: () => void;
}

export type Inputs = {
  url: string;
  name: string;
  region: string;
  frequency: string;
  failures_before_alert?: number;
  webhook_url?: string;
  http_parameters: {
    method: HttpMethods;
    body: string;
    headers: {
      header: string;
      value: string;
    }[];
    follow_redirects: boolean;
  };
  up_condition_checks?: UpConditionCheck[];
  alert?: Alert;
  project_id: string;
};

// Used to prefill fields with current monitor attributes
function createFormPlaceholdersFromMonitor(monitor: UptimeMonitor | undefined) {
  if (!monitor) return undefined;
  let http_headers;
  if (monitor.http_parameters.headers !== undefined) {
    http_headers = Object.keys(monitor.http_parameters.headers).map(
      (header) => ({
        header: header,
        value: monitor.http_parameters.headers![header],
      })
    );
  }
  const { http_parameters, ...rest } = monitor;
  const placeholders: any = {
    ...rest,
  };
  if (placeholders.webhook_url) {
    placeholders.webhook_url = placeholders.webhook_url.replace("https://", "");
  } else {
    placeholders.webhook_url = "";
  }
  placeholders.url = placeholders.url.replace("https://", "");
  placeholders.frequency = placeholders.frequency.toString();
  placeholders.up_condition_checks = monitor.up_condition_checks;
  placeholders.http_parameters = {};
  placeholders.http_parameters["headers"] = http_headers;
  placeholders.http_parameters["body"] = monitor.http_parameters.body;
  placeholders.http_parameters["method"] = monitor.http_parameters.method;
  placeholders.http_parameters["follow_redirects"] =
    monitor.http_parameters.follow_redirects;

  // set webhook alert url if it exists
  if (monitor.alert && monitor.alert.recipients.Webhook !== undefined) {
    if (monitor.alert.recipients.Webhook.length > 0) {
      placeholders.alert.recipients.Webhook = [
        monitor.alert.recipients.Webhook[0].replace("https://", ""),
      ];
    }
  }
  return placeholders as Inputs;
}

function createFrequencySelectOptionsReactSelect(productId: string) {
  return Object.getOwnPropertyNames(minutesToString).map((minutes) => ({
    value: Number.parseInt(minutes).toString(),
    label: minutesToString[Number.parseInt(minutes)],
    isDisabled: productId === PLAN_PRODUCT_IDS.STARTER && minutes === "1",
  }));
}

function createRegionSelectOptions() {
  return Object.keys(regionToLocationStringMap).map((region) => ({
    value: region,
    label: regionToLocationStringMap[region],
    isDisabled: false,
  }));
}

function createHttpMethodOptions() {
  return ["GET", "POST", "PATCH", "PUT", "HEAD", "DELETE"].map((method) => ({
    value: method,
    label: method,
    isDisabled: false,
  }));
}

export const CreateUpdateFormRewrite = (props: CreateUpdateFormProps) => {
  let { product_id, currentMonitorAttributes, closeForm } = props;

  const { teamId } = useRouter().query;

  const placeholders = React.useMemo(() => {
    return createFormPlaceholdersFromMonitor(
      currentMonitorAttributes
    ) as unknown as Inputs;
  }, [currentMonitorAttributes]);

  const createNewMonitor = currentMonitorAttributes === undefined;

  const router = useRouter();
  const { projectId } = router.query;

  const { mutate } = useUptimeMonitorsForProject(projectId as string);

  const errorToast = useToast();

  const methods = useForm<Inputs>({
    defaultValues: createNewMonitor
      ? {
          project_id: projectId as string,
          http_parameters: { follow_redirects: true },
        }
      : placeholders,
  });
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting, touchedFields },
    control,
    setValue,
    resetField,
    reset,
    getValues,
    clearErrors,
    setError,
  } = methods;
  const { fields, append, remove } = useFieldArray({
    control,
    name: "http_parameters.headers",
  });
  const {
    fields: upConditionFields,
    append: appendUpCondition,
    remove: removeUpCondition,
  } = useFieldArray({ control, name: "up_condition_checks" });

  const watchHttpHeaderArray = watch("http_parameters.headers");
  const watchFollowRedirects = watch("http_parameters.follow_redirects");
  const controlledHttpHeaderFields = fields.map((field, index) => {
    return {
      ...field,
      ...watchHttpHeaderArray[index],
    };
  });

  const [hasAlert, setHasAlert] = React.useState<boolean>(
    currentMonitorAttributes?.alert !== undefined
  );

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
    if (hasAlert) {
      if (data.alert && data.alert.recipients === undefined) {
        setError("alert.recipients", {
          type: "required",
          message: "An alert channel is required.",
        });
        return;
      } else {
        // check if at least one recipient exists across all channels and set channels accordingly
        let hasARecipient = false;
        if (data.alert?.recipients) {
          for (let key of Object.keys(data.alert?.recipients)) {
            const recipientList = (
              data.alert?.recipients as { [key: string]: string[] | undefined }
            )[key];
            if (
              recipientList &&
              recipientList.length > 0 &&
              key !== "Webhook"
            ) {
              hasARecipient = true;
              if (!data.alert.channels) data.alert.channels = [];
              data.alert.channels.push(key as ChannelType);
              data.alert.channels = Array.from(new Set(data.alert.channels));
            } else {
              if (data.alert.channels) {
                const s = new Set(data.alert.channels);
                s.delete(key as ChannelType);
                data.alert.channels = Array.from(s);
              }
            }

            if (key === "Webhook") {
              if (recipientList && recipientList?.length > 0) {
                // delete if empty -> workaround for default value
                if (recipientList[0] === "") {
                  if (data.alert.channels) {
                    const s = new Set(data.alert.channels);
                    s.delete(key as ChannelType);
                    data.alert.channels = Array.from(s);
                  }
                  data.alert.recipients.Webhook = undefined;
                } else if (recipientList[0].length > 400) {
                  setError("alert.recipients.Webhook", {
                    type: "maxLength",
                    message:
                      "Webhook URL must be 400 characters or less in length.",
                  });
                  hasARecipient = true;
                  if (!data.alert.channels) data.alert.channels = [];
                  data.alert.channels.push(key as ChannelType);
                  data.alert.channels = Array.from(
                    new Set(data.alert.channels)
                  );
                } else {
                  hasARecipient = true;
                  if (!data.alert.channels) data.alert.channels = [];
                  data.alert.channels.push(key as ChannelType);
                  data.alert.channels = Array.from(
                    new Set(data.alert.channels)
                  );
                }
              } else if (recipientList && recipientList.length === 0) {
                data.alert.recipients.Webhook = undefined;
              }
            }
          }
        }

        if (!hasARecipient) {
          setError("alert.recipients", {
            type: "required",
            message: "At least one recipient in any alert channel is required.",
          });
          return;
        }
      }
    } else {
      data.failures_before_alert = undefined;
      data.alert = undefined;
    }

    if (data.webhook_url === "") data.webhook_url = undefined;

    if (createNewMonitor && Object.keys(errors).length === 0) {
      await createMonitor(
        data,
        teamId as string,
        async () => {
          await mutate();
          closeForm();
        },
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
        teamId as string,
        async () => {
          await mutate();
          closeForm();
        },
        postErrorToast
      );
    }
  };
  return (
    <>
      <Container mb="3em" p="0" maxW="7xl">
        <FormProvider {...methods}>
          <chakra.form onSubmit={handleSubmit(onSubmit)}>
            <Box
              p="2em"
              borderRadius="md"
              shadow="md"
              bg={useColorModeValue("white", "gray.950")}
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
                    isDisabled={!createNewMonitor}
                  >
                    <FormLabel htmlFor="url">
                      URL {!createNewMonitor && "(URL not editable.)"}
                    </FormLabel>
                    <InputGroup id="url">
                      <InputLeftAddon children="https://" />
                      <Input {...field} placeholder="your-website.com" />
                    </InputGroup>
                    <FormHelperText>
                      Note: "https://" is already included in URL. HTTP is not
                      supported.
                    </FormHelperText>
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
                    <FormErrorMessage>
                      {errors.region?.message}
                    </FormErrorMessage>
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
                    isInvalid={
                      errors.frequency ? touchedFields.frequency : false
                    }
                    isRequired
                    mb="1.5em"
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
              <Controller
                name="webhook_url"
                defaultValue=""
                control={control}
                rules={{
                  maxLength: {
                    value: 400,
                    message: "URL must be 400 characters or under in length",
                  },
                }}
                render={({ field }) => (
                  <FormControl
                    isInvalid={
                      errors.webhook_url ? touchedFields.webhook_url : false
                    }
                    isDisabled={product_id === PLAN_PRODUCT_IDS.STARTER}
                    mb=".5em"
                  >
                    <FormLabel htmlFor="webhookUrl">Webhook URL</FormLabel>
                    <InputGroup id="webhookUrl">
                      <InputLeftAddon children="https://" />
                      <Input {...field} placeholder="your-webhook-url.com" />
                    </InputGroup>
                    <FormHelperText>
                      Note: "https://" is already included in URL. HTTP is not
                      supported.
                    </FormHelperText>
                    <FormErrorMessage>
                      {errors.webhook_url?.message}
                    </FormErrorMessage>
                    <Flex mt="5px" justifyContent="space-between">
                      {product_id === PLAN_PRODUCT_IDS.STARTER && (
                        <Box>
                          Webhooks are a paid feature.{" "}
                          <Link href="/pricing" passHref>
                            <Button
                              as="a"
                              target="_blank"
                              variant="unstyled"
                              color="blue.400"
                              _hover={{
                                color: "blue.600",
                              }}
                              fontWeight="normal"
                            >
                              Upgrade now.
                            </Button>
                          </Link>
                        </Box>
                      )}
                      <Box>
                        <Link
                          href="/docs/webhooks/uptime-monitor-status"
                          passHref
                        >
                          <Button
                            as="a"
                            target="_blank"
                            variant="unstyled"
                            color="blue.400"
                            _hover={{
                              color: "blue.600",
                            }}
                            fontWeight="normal"
                          >
                            Learn more about webhooks
                          </Button>
                        </Link>
                      </Box>
                    </Flex>
                  </FormControl>
                )}
              />
            </Box>
            <Box
              p="2em"
              borderRadius="md"
              shadow="md"
              mb="1.5em"
              bg={useColorModeValue("white", "gray.950")}
            >
              <Flex justifyContent="space-between">
                <Heading size="md">Alert Settings</Heading>
                <Box>
                  <chakra.span mr="1rem" fontSize="lg" fontWeight="medium">
                    Add an alert?
                  </chakra.span>
                  <Switch
                    size="lg"
                    isChecked={hasAlert}
                    onChange={(e) => {
                      if (!e.target.checked) {
                        clearErrors("alert.recipients");
                        clearErrors("alert.description");
                        resetField("alert");
                      }
                      setHasAlert(e.target.checked);
                    }}
                  />
                </Box>
              </Flex>

              <Controller
                name="failures_before_alert"
                control={control}
                defaultValue={1}
                rules={
                  hasAlert
                    ? {
                        required: "Required.",
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
                      }
                    : undefined
                }
                render={({ field }) => (
                  <FormControl
                    isInvalid={
                      errors.failures_before_alert
                        ? touchedFields.failures_before_alert
                        : false
                    }
                    isRequired
                    isDisabled={!hasAlert}
                    mb=".5em"
                  >
                    <FormLabel htmlFor="failuresBeforeRetry">
                      <Tooltip
                        placement="right-end"
                        label="Number of failed uptime checks before an alert is sent."
                        openDelay={500}
                      >
                        Failures Before Alert
                      </Tooltip>
                    </FormLabel>
                    <NumberInput
                      min={1}
                      step={1}
                      max={5}
                      clampValueOnBlur={false}
                      value={hasAlert ? field.value : ""}
                    >
                      <NumberInputField
                        {...field}
                        placeholder="Failure amount"
                        value={hasAlert ? field.value : ""}
                      />
                    </NumberInput>
                    <FormErrorMessage>
                      {errors.failures_before_alert?.message}
                    </FormErrorMessage>
                  </FormControl>
                )}
              />
              <Controller
                name="alert.description"
                defaultValue=""
                control={control}
                rules={
                  hasAlert
                    ? {
                        maxLength: {
                          value: 300,
                          message:
                            "Description must be 300 characters or less.",
                        },
                      }
                    : undefined
                }
                render={({ field }) => (
                  <FormControl
                    isInvalid={
                      errors.alert?.description
                        ? touchedFields.alert?.description
                        : false
                    }
                    isRequired
                    mb="1.5em"
                    isDisabled={!hasAlert}
                  >
                    <FormLabel htmlFor="description">
                      Alert Description
                    </FormLabel>
                    <Textarea
                      {...field}
                      id="description"
                      placeholder="Alert Description"
                      isDisabled={!hasAlert}
                      value={hasAlert ? field.value : ""}
                    />
                    <FormHelperText>
                      Descriptions appear in the alert when they are sent. You
                      should put useful information about the alert and/or
                      incident action items here.
                    </FormHelperText>
                    <FormErrorMessage>
                      {errors.alert?.description?.message}
                    </FormErrorMessage>
                  </FormControl>
                )}
              />
              {errors.alert?.recipients && (
                <chakra.span color="red.400" fontSize="md">
                  {(errors.alert.recipients as any).message}
                </chakra.span>
              )}
              <RecipientFormController
                control={control}
                productId={product_id}
                postErrorToast={postErrorToast}
                setValue={setValue}
                hasAlert={hasAlert}
                currentValues={getValues("alert.recipients")}
                clearErrors={clearErrors}
              />
            </Box>
            <Box
              p="2em"
              borderRadius="md"
              shadow="md"
              bg={useColorModeValue("white", "gray.950")}
              mb="1.5em"
            >
              <Accordion allowToggle>
                <AccordionItem border="none">
                  <AccordionButton
                    borderRadius="md"
                    _hover={{
                      bgColor: useColorModeValue("gray.50", "gray.500"),
                    }}
                  >
                    <Heading size="md">HTTP Settings</Heading>
                    <AccordionIcon boxSize="8" />
                  </AccordionButton>
                  <AccordionPanel pb={4}>
                    <Controller
                      name="http_parameters.method"
                      defaultValue="GET"
                      control={control}
                      rules={{
                        required: "HTTP method is required.",
                      }}
                      render={({ field }) => (
                        <FormControl
                          isInvalid={
                            errors.http_parameters?.method
                              ? touchedFields.http_parameters?.method
                              : false
                          }
                          isRequired
                          mb="1.5em"
                        >
                          <FormLabel htmlFor="http_parameters.method">
                            HTTP Method
                          </FormLabel>
                          <ReactSelect
                            options={createHttpMethodOptions()}
                            placeholder="Select HTTP Method"
                            field={field as any}
                            setValue={setValue}
                          />
                          <FormErrorMessage>
                            {errors.http_parameters?.method?.message}
                          </FormErrorMessage>
                        </FormControl>
                      )}
                    />
                    <Controller
                      name="http_parameters.body"
                      control={control}
                      rules={{}}
                      render={({ field }) => (
                        <FormControl
                          isInvalid={
                            errors.http_parameters?.body
                              ? touchedFields.http_parameters?.body
                              : false
                          }
                          mb="1.5em"
                        >
                          <FormLabel htmlFor="http_parameters.body">
                            HTTP Body
                          </FormLabel>
                          <Textarea
                            {...field}
                            id="http_parameters.body"
                            placeholder="HTTP Body"
                          />
                          <FormHelperText>
                            Remember to set the Content-Type Header below!
                          </FormHelperText>
                          <FormErrorMessage>
                            {errors.http_parameters?.body?.message}
                          </FormErrorMessage>
                        </FormControl>
                      )}
                    />
                    <Controller
                      control={control}
                      name="http_parameters.follow_redirects"
                      render={({ field }) => (
                        <FormControl mb="1.5em">
                          <Checkbox
                            {...field}
                            isChecked={watchFollowRedirects}
                            value="follow redirects"
                          >
                            Follow redirects
                          </Checkbox>
                        </FormControl>
                      )}
                    />
                    <HttpHeaderFormField
                      fields={controlledHttpHeaderFields}
                      touchedFields={touchedFields as any}
                      append={append}
                      remove={remove}
                      errors={errors as any}
                      productId={product_id}
                      setValue={setValue}
                      control={control}
                    />
                  </AccordionPanel>
                </AccordionItem>
              </Accordion>
            </Box>
            <Box
              p="2em"
              borderRadius="md"
              shadow="md"
              mb="1.5em"
              bg={useColorModeValue("white", "gray.950")}
            >
              <Accordion allowToggle>
                <AccordionItem border="none">
                  <AccordionButton
                    borderRadius="md"
                    _hover={{
                      bgColor: useColorModeValue("gray.50", "gray.500"),
                    }}
                  >
                    <Heading size="md">Up Condition Checks</Heading>
                    <AccordionIcon boxSize="8" />
                  </AccordionButton>
                  <AccordionPanel pb={4}>
                    <UpConditionCheckFields
                      fields={upConditionFields}
                      append={appendUpCondition}
                      remove={removeUpCondition}
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
              onClick={closeForm}
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
        </FormProvider>
      </Container>
    </>
  );
};
