import { ExternalLinkIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  chakra,
  Flex,
  FormControl,
  FormHelperText,
  FormLabel,
  Input,
  InputGroup,
  InputLeftAddon,
  Switch,
  useColorModeValue,
} from "@chakra-ui/react";
import Link from "next/link";
import { SlackInstallation } from "project-types";
import React from "react";
import {
  Control,
  Controller,
  useController,
  UseFormClearErrors,
  UseFormSetValue,
} from "react-hook-form";
import {
  MultiSelectTextInput,
  ReactSelect,
} from "../../../common/components/React-Select";
import {
  getAlertRecipientLimitFromProductId,
  PLAN_PRODUCT_IDS,
} from "../../billing/plans";
import { useUserSlackInstallations } from "../../user/client";
import { Inputs } from "./Create-Update-Form-Rewrite";

interface RecipientFormControllerProps {
  control: Control<Inputs, object>;
  productId: string;
  postErrorToast: (message: string) => string | number | undefined;
  setValue: UseFormSetValue<Inputs>;
  hasAlert: boolean;
  currentValues: {
    Email?: string[];
    Slack?: string[];
    Webhook?: string[];
  };
  clearErrors: UseFormClearErrors<Inputs>;
}

const createTeamChannelIdCompoundKey = (installation: SlackInstallation) => {
  return [installation.team?.id, installation.incomingWebhook?.channelId].join(
    "#"
  );
};

const createSlackInstallationOptions = (installations: SlackInstallation[]) => {
  return installations.map((i) => ({
    label: (i.incomingWebhook?.channel as string) + ` (in ${i.team?.name})`,
    value: createTeamChannelIdCompoundKey(i),
    isDisabled: false,
  }));
};

interface WebhookControllerProps {
  productId: string;
  addWebhook: boolean;
  toggleAddWebhook: React.Dispatch<React.SetStateAction<boolean>>;
  hasAlert: boolean;
  clearErrors: UseFormClearErrors<Inputs>;
  setValue: UseFormSetValue<Inputs>;
  control: Control<Inputs, object>;
}

const WebhookController = ({
  productId,
  addWebhook,
  toggleAddWebhook,
  hasAlert,
  clearErrors,
  setValue,
  control,
}: WebhookControllerProps) => {
  return (
    <>
      <Flex mt="1em" justifyContent="space-between">
        <Box>
          <Switch
            isChecked={addWebhook}
            isDisabled={!hasAlert || productId === PLAN_PRODUCT_IDS.FREE}
            onChange={(e) => {
              toggleAddWebhook(e.target.checked);
              clearErrors("alert.recipients.Webhook");
              if (!e.target.checked)
                setValue("alert.recipients.Webhook", undefined);
            }}
          />
          <chakra.span
            ml="1rem"
            fontWeight="medium"
            opacity={!hasAlert ? 0.4 : 1}
          >
            Add Webhook Alert
          </chakra.span>
        </Box>
        {productId === PLAN_PRODUCT_IDS.FREE && (
          <Box>
            <Link href="/pricing" passHref>
              <Button
                as="a"
                target="_blank"
                rightIcon={<ExternalLinkIcon />}
                variant="unstyled"
                color="blue.400"
                _hover={{
                  color: "blue.600",
                }}
              >
                Upgrade account for access to webhook alert
              </Button>
            </Link>
          </Box>
        )}
        {productId !== PLAN_PRODUCT_IDS.FREE && (
          <Box>
            <Link href="/docs/webhooks/alerts" passHref>
              <Button
                as="a"
                target="_blank"
                rightIcon={<ExternalLinkIcon />}
                variant="unstyled"
                color="blue.400"
                _hover={{
                  color: "blue.600",
                }}
              >
                Learn more about webhook alerts
              </Button>
            </Link>
          </Box>
        )}
      </Flex>
      {addWebhook && productId !== PLAN_PRODUCT_IDS.FREE && (
        <Controller
          name="alert.recipients.Webhook"
          control={control}
          defaultValue={[]}
          render={({ field, fieldState }) => (
            <FormControl
              isDisabled={!hasAlert || !addWebhook}
              isInvalid={fieldState.error ? fieldState.isTouched : false}
              isRequired
              mt="1em"
            >
              <FormLabel htmlFor="recipients">Webhook URL</FormLabel>
              <InputGroup id="url">
                <InputLeftAddon children="https://" />
                <Input
                  {...field}
                  placeholder="your-webhook-url.com"
                  onChange={(e) => {
                    clearErrors("alert.recipients");
                    if (e.target.value === "")
                      setValue("alert.recipients.Webhook", []);
                    else setValue("alert.recipients.Webhook", [e.target.value]);
                  }}
                />
              </InputGroup>
              <FormHelperText>
                Note: "https://" is already included in URL. HTTP is not
                supported.
              </FormHelperText>
              <chakra.div
                fontSize="sm"
                mt="5px"
                color={useColorModeValue("red.500", "red.300")}
              >
                {fieldState.error && fieldState.error.message}
              </chakra.div>
            </FormControl>
          )}
        />
      )}
    </>
  );
};

export const RecipientFormController = (
  props: RecipientFormControllerProps
) => {
  const {
    control,
    productId,
    postErrorToast,
    setValue,
    hasAlert,
    currentValues,
    clearErrors,
  } = props;
  let {
    data: slackInstallations,
    isError: slackIsError,
    isLoading: slackIsLoading,
  } = useUserSlackInstallations();
  const { field: emailField } = useController({
    control: control,
    name: "alert.recipients.Email",
  });
  const { field: slackField } = useController({
    control: control,
    name: "alert.recipients.Slack",
  });
  const { field: webhookField } = useController({
    control: control,
    name: "alert.recipients.Webhook",
  });
  const [addEmail, toggleAddEmail] = React.useState<boolean>(
    emailField.value ? emailField.value.length > 0 : false
  );
  const [addSlack, toggleAddSlack] = React.useState<boolean>(
    slackField.value ? slackField.value.length > 0 : false
  );
  const [addWebhook, toggleAddWebhook] = React.useState<boolean>(
    webhookField.value ? webhookField.value.length > 0 : false
  );

  // for updating existing monitors
  React.useEffect(() => {
    if (!hasAlert) {
      toggleAddEmail(false);
      toggleAddSlack(false);
      toggleAddWebhook(false);
    } else {
      if (emailField.value && emailField.value.length > 0) toggleAddEmail(true);
      if (slackField.value && slackField.value.length > 0) toggleAddSlack(true);
      if (webhookField.value && webhookField.value.length > 0)
        toggleAddWebhook(true);
    }
  }, [hasAlert]);

  return (
    <Flex flexDir="column" mb="1em">
      <Flex>
        <Switch
          isChecked={addEmail}
          isDisabled={!hasAlert}
          onChange={(e) => {
            toggleAddEmail(e.target.checked);
            clearErrors("alert.recipients.Email");
            if (!e.target.checked)
              setValue("alert.recipients.Email", undefined);
          }}
        />
        <chakra.span
          ml="1rem"
          fontWeight="medium"
          opacity={!hasAlert ? 0.4 : 1}
        >
          Add Email Alert
        </chakra.span>
      </Flex>
      {addEmail && (
        <Controller
          name="alert.recipients.Email"
          control={control}
          render={({ field, fieldState }) => {
            return (
              <FormControl
                isInvalid={fieldState.error ? fieldState.isTouched : false}
                isDisabled={!hasAlert || !addEmail}
                isRequired
                mt="1em"
                onChange={() => clearErrors("alert.recipients")}
              >
                <FormLabel htmlFor="recipients">Email Recipients</FormLabel>
                <MultiSelectTextInput
                  placeholder="Recipients"
                  field={field as any}
                  initialValue={currentValues?.Email ?? []}
                  selectLimit={getAlertRecipientLimitFromProductId(productId)}
                  postErrorToast={postErrorToast}
                  setValue={setValue}
                />
                <FormHelperText>
                  Recipients should be email addresses. Press Enter or Tab after
                  input.
                </FormHelperText>

                <chakra.div
                  fontSize="sm"
                  color={useColorModeValue("red.500", "red.300")}
                >
                  {fieldState.error?.message}
                </chakra.div>
              </FormControl>
            );
          }}
        />
      )}
      <Flex mt="1em">
        <Switch
          display={!slackInstallations && !slackIsLoading ? "none" : "inherit"}
          isChecked={addSlack}
          isDisabled={!hasAlert || (!slackInstallations && !slackIsLoading)}
          onChange={(e) => {
            toggleAddSlack(e.target.checked);
            clearErrors("alert.recipients.Slack");
            if (!e.target.checked)
              setValue("alert.recipients.Slack", undefined);
          }}
        />
        {(!slackInstallations || slackInstallations.length === 0) &&
        !slackIsLoading ? (
          <Box ml="1rem">
            <Link href="/app/integrations" passHref>
              <chakra.a
                target="_blank"
                fontWeight="normal"
                color="blue.500"
                _hover={{ color: "blue.700" }}
              >
                Add Slack integration
              </chakra.a>
            </Link>{" "}
            <chakra.span color="gray.500">
              (go to integrations page)
            </chakra.span>
          </Box>
        ) : (
          <chakra.span
            ml="1rem"
            fontWeight="medium"
            opacity={!hasAlert ? 0.4 : 1}
          >
            Add Slack Alert
          </chakra.span>
        )}
      </Flex>
      {addSlack && slackInstallations !== undefined && (
        <Controller
          name="alert.recipients.Slack"
          control={control}
          render={({ field, fieldState }) => {
            if (slackInstallations !== undefined) {
              const installationOptions =
                createSlackInstallationOptions(slackInstallations);

              return (
                <FormControl
                  isDisabled={!hasAlert || !addSlack}
                  isInvalid={fieldState.error ? fieldState.isTouched : false}
                  isRequired
                  mt="1em"
                >
                  <FormLabel htmlFor="recipients">Slack Channel</FormLabel>
                  <ReactSelect
                    defaultValue={
                      field.value ? installationOptions[0] : undefined
                    }
                    options={installationOptions}
                    placeholder={"Slack Channel"}
                    field={field as any}
                    setValue={(fieldName: string, value: string) => {
                      clearErrors("alert.recipients");
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
          }}
        />
      )}
      <WebhookController
        productId={productId}
        addWebhook={addWebhook}
        toggleAddWebhook={toggleAddWebhook}
        hasAlert={hasAlert}
        clearErrors={clearErrors}
        setValue={setValue}
        control={control}
      />
    </Flex>
  );
};
