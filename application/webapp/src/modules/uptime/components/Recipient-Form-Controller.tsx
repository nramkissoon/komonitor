import {
  Box,
  chakra,
  Flex,
  FormControl,
  FormHelperText,
  FormLabel,
  Switch,
  useColorModeValue,
} from "@chakra-ui/react";
import Link from "next/link";
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
import { getAlertRecipientLimitFromProductId } from "../../billing/plans";
import { useUserSlackInstallation } from "../../user/client";
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
  };
  clearErrors: UseFormClearErrors<Inputs>;
}

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
    data: slackInstallation,
    isError: slackIsError,
    isLoading: slackIsLoading,
  } = useUserSlackInstallation();
  const { field: emailField } = useController({
    control: control,
    name: "alert.recipients.Email",
  });
  const { field: slackField } = useController({
    control: control,
    name: "alert.recipients.Slack",
  });
  const [addEmail, toggleAddEmail] = React.useState<boolean>(
    emailField.value ? emailField.value.length > 0 : false
  );
  const [addSlack, toggleAddSlack] = React.useState<boolean>(
    slackField.value ? slackField.value.length > 0 : false
  );
  React.useEffect(() => {
    if (!hasAlert) {
      toggleAddEmail(false);
      toggleAddSlack(false);
    } else {
      if (emailField.value && emailField.value.length > 0) toggleAddEmail(true);
      if (slackField.value && slackField.value.length > 0) toggleAddSlack(true);
    }
  }, [hasAlert]);

  return (
    <Flex flexDir="column" mb="1em">
      <Flex>
        <chakra.span
          mr="1rem"
          fontWeight="medium"
          opacity={!hasAlert ? 0.4 : 1}
        >
          Add Email Alert
        </chakra.span>
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
        {!slackInstallation && !slackIsLoading ? (
          <Box>
            <Link href="/app/settings?tab=2" passHref>
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
              (opens new tab on settings page)
            </chakra.span>
          </Box>
        ) : (
          <chakra.span
            mr="1rem"
            fontWeight="medium"
            opacity={!hasAlert ? 0.4 : 1}
          >
            Add Slack Alert
          </chakra.span>
        )}
        <Switch
          display={!slackInstallation && !slackIsLoading ? "none" : "inherit"}
          isChecked={addSlack}
          isDisabled={!hasAlert || (!slackInstallation && !slackIsLoading)}
          onChange={(e) => {
            toggleAddSlack(e.target.checked);
            clearErrors("alert.recipients.Slack");
            if (!e.target.checked)
              setValue("alert.recipients.Slack", undefined);
          }}
        />
      </Flex>
      {addSlack && slackInstallation && (
        <Controller
          name="alert.recipients.Slack"
          control={control}
          render={({ field, fieldState }) => {
            if (slackInstallation) {
              const installationOption = {
                label: slackInstallation.incomingWebhook?.channel as string,
                value: slackInstallation.incomingWebhook?.channelId as string,
                isDisabled: false,
              };
              return (
                <FormControl
                  isDisabled={!hasAlert || !addSlack}
                  isInvalid={fieldState.error ? fieldState.isTouched : false}
                  isRequired
                  mt="1em"
                >
                  <FormLabel htmlFor="recipients">
                    Slack Channel (Workspace: {slackInstallation.team?.name})
                  </FormLabel>
                  <ReactSelect
                    defaultValue={field.value ? installationOption : undefined}
                    options={[installationOption]}
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
    </Flex>
  );
};
