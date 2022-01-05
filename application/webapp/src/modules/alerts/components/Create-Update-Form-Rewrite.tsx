import {
  Box,
  Button,
  chakra,
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
import Router, { useRouter } from "next/router";
import { Alert, AlertSeverities, AlertStates, AlertTypes } from "project-types";
import React from "react";
import {
  Control,
  Controller,
  SubmitHandler,
  useForm,
  UseFormSetValue,
} from "react-hook-form";
import {
  MultiSelectTextInput,
  ReactSelect,
} from "../../../common/components/React-Select";
import { getAlertRecipientLimitFromProductId } from "../../billing/plans";
import { useUserSlackInstallation } from "../../user/client";
import { createAlert, updateAlert } from "../client";

interface CreateUpdateFormProps {
  productId: string;
  currentAlertAttributes?: Alert;
}

export type Inputs = {
  name: string;
  description: string;
  severity: string;
  recipients: string[];
  state: string;
  type: string;
};

// used to prefill fields with current alert attributes
function createFormPlaceholdersFromAlert(alert: Alert | undefined) {
  if (!alert) return;
  const placeholder: any = { ...alert };
  return placeholder;
}

function alertTypeToRecipientHelpString(type: AlertTypes) {
  switch (type) {
    case "Email":
      return "email addresses";
    default:
      return "";
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
  const types: AlertTypes[] = ["Email", "Slack"];
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

const RecipientsController = (props: {
  control: Control<Inputs, object>;
  selectedType: AlertTypes;
  productId: string;
  postErrorToast: (message: string) => string | number | undefined;
  currentValue: string[];
  setValue: UseFormSetValue<Inputs>;
}) => {
  const {
    control,
    selectedType,
    productId,
    postErrorToast,
    currentValue,
    setValue,
  } = props;

  const { data: installation, isError, isLoading } = useUserSlackInstallation();

  return (
    <Controller
      name="recipients"
      control={control}
      rules={{
        required: "At least 1 recipient is required.",
      }}
      render={({ field, fieldState }) => {
        switch (selectedType) {
          case "Email":
            return (
              <FormControl
                isInvalid={fieldState.error ? fieldState.isTouched : false}
                isRequired
                mb="1.5em"
              >
                <FormLabel htmlFor="recipients">Email Recipients</FormLabel>
                <MultiSelectTextInput
                  placeholder="Recipients"
                  field={field as any}
                  initialValue={currentValue}
                  selectLimit={getAlertRecipientLimitFromProductId(productId)}
                  postErrorToast={postErrorToast}
                  setValue={setValue}
                />
                <FormHelperText>
                  Recipients should be {alertTypeToRecipientHelpString("Email")}
                  . Press Enter or Tab after input.
                </FormHelperText>

                <chakra.div
                  fontSize="sm"
                  color={useColorModeValue("red.500", "red.300")}
                >
                  {fieldState.error?.message}
                </chakra.div>
              </FormControl>
            );
          case "Slack":
            if (installation) {
              console.log(fieldState.error);
              console.log(field.value);
              const installationOption = {
                label: installation.incomingWebhook?.channel as string,
                value: installation.incomingWebhook?.channelId as string,
                isDisabled: false,
              };
              return (
                <FormControl
                  isInvalid={fieldState.error ? fieldState.isTouched : false}
                  isRequired
                  mb="1.5em"
                >
                  <FormLabel htmlFor="recipients">
                    Slack Channel (Workspace: {installation.team?.name})
                  </FormLabel>
                  <ReactSelect
                    defaultValue={installationOption}
                    options={[installationOption]}
                    placeholder={"Slack Channel"}
                    field={field as any}
                    setValue={(fieldName: string, value: string) => {
                      if (value !== "") setValue(fieldName as any, [value]);
                      else setValue(fieldName as any, []);
                    }}
                  />
                  <chakra.div
                    fontSize="sm"
                    mt="5px"
                    color={useColorModeValue("red.500", "red.300")}
                  >
                    {fieldState.error?.message !== undefined &&
                      "Please select a Slack Channel to send alerts to."}
                  </chakra.div>
                </FormControl>
              );
            }
            return <></>;

          default:
            return <></>;
        }
      }}
    />
  );
};

export const CreateUpdateFormRewrite = (props: CreateUpdateFormProps) => {
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

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting, touchedFields },
    control,
    setValue,
    getValues,
    clearErrors,
    resetField,
  } = useForm<Inputs>({
    defaultValues: createNewAlert
      ? { state: "enabled", type: "Email", severity: "Warning" }
      : (createFormPlaceholdersFromAlert(
          currentAlertAttributes
        ) as unknown as Inputs),
  });

  const watchType = watch("type");

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    if (createNewAlert) {
      await createAlert(
        data,
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
        ...data,
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
        {createNewAlert ? "Create Alert" : "Edit Alert"}
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
              Alert Settings
            </Heading>
            <Controller
              name="name"
              defaultValue=""
              control={control}
              rules={{
                required: "Alert name is required.",
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
                  <Input {...field} id="name" placeholder="Alert Name" />
                  <FormErrorMessage>{errors.name?.message}</FormErrorMessage>
                </FormControl>
              )}
            />
            <Controller
              name="type"
              control={control}
              rules={{
                required: "Type is required.",
              }}
              render={({ field }) => (
                <FormControl
                  isInvalid={errors.type ? touchedFields.type : false}
                  isRequired
                  mb="1.5em"
                  isDisabled={!createNewAlert} // disable when updating alert.
                >
                  <FormLabel htmlFor="type">Alert Type</FormLabel>
                  <ReactSelect
                    isDisabled={!createNewAlert}
                    options={createAlertTypeSelectOptions(
                      !createNewAlert ? (field.value as AlertTypes) : undefined
                    )}
                    placeholder="Select Alert Type"
                    field={field as any}
                    setValue={(name: string, value: string) => {
                      resetField("recipients"); // MUST RESET THE RECIPIENTS AND ERRORS
                      setValue(name as any, value);
                    }}
                  />
                  {!createNewAlert && (
                    <FormHelperText>
                      Alert types are not editable.
                    </FormHelperText>
                  )}
                  <FormErrorMessage>{errors.type?.message}</FormErrorMessage>
                </FormControl>
              )}
            />
            {watchType && (
              <RecipientsController
                control={control}
                selectedType={getValues("type") as AlertTypes}
                postErrorToast={postErrorToast}
                productId={productId}
                currentValue={getValues("recipients")}
                setValue={setValue}
              />
            )}
            <Controller
              name="severity"
              control={control}
              rules={{ required: "Severity is required." }}
              render={({ field }) => (
                <FormControl
                  isInvalid={errors.severity ? touchedFields.severity : false}
                  isRequired
                  mb="1.5em"
                >
                  <FormLabel htmlFor="severity">Severity</FormLabel>
                  <ReactSelect
                    options={createSeveritySelectOptions()}
                    placeholder="Alert severity"
                    field={field as any}
                    setValue={setValue}
                  />
                  <FormErrorMessage>
                    {errors.severity?.message}
                  </FormErrorMessage>
                </FormControl>
              )}
            />
            <Controller
              name="description"
              defaultValue=""
              control={control}
              rules={{
                required: "Description is required.",
                maxLength: {
                  value: 300,
                  message: "Description must be 300 characters or less.",
                },
              }}
              render={({ field }) => (
                <FormControl
                  isInvalid={
                    errors.description ? touchedFields.description : false
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
                    {errors.description?.message}
                  </FormErrorMessage>
                </FormControl>
              )}
            />

            <Controller
              name="state"
              control={control}
              rules={{ required: "State is required" }}
              render={({ field }) => (
                <FormControl
                  isInvalid={errors.state ? touchedFields.state : false}
                  isRequired
                  mb="1.5em"
                  isDisabled={createNewAlert}
                >
                  <FormLabel htmlFor="state">State</FormLabel>
                  <ReactSelect
                    options={createAlertStateOptions()}
                    placeholder="Alert state"
                    field={field as any}
                    isDisabled={createNewAlert}
                    setValue={setValue}
                  />
                  {createNewAlert && (
                    <FormHelperText>
                      Alert state is set to default "enabled" on creation.
                    </FormHelperText>
                  )}
                  {!createNewAlert && getValues("state") === "disabled" && (
                    <FormHelperText textColor="yellow.500">
                      Disabled alerts will not send messaged to any recipients.
                    </FormHelperText>
                  )}
                  <FormErrorMessage>{errors.state?.message}</FormErrorMessage>
                </FormControl>
              )}
            />
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
            {createNewAlert ? "Create" : "Update"}
          </Button>
        </chakra.form>
      </Container>
    </>
  );
};
