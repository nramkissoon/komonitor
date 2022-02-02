import { DeleteIcon, QuestionOutlineIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  chakra,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Heading,
  IconButton,
  Input,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  Tooltip,
  useColorModeValue,
} from "@chakra-ui/react";
import { JsonOperators, UpConditionCheck } from "project-types";
import {
  Controller,
  FieldArrayMethodProps,
  FieldArrayWithId,
  useFormContext,
  UseFormReturn,
} from "react-hook-form";
import { ReactSelect } from "../../../common/components/React-Select";
import { Inputs } from "./Create-Update-Form-Rewrite";

const checkTypeToDisplayString: { [key: string]: string } = {
  latency: "Latency",
  code: "Status Code",
  json_body: "JSON Response Body",
  html_body: "HTML Response Body",
};

const checkTypeOptions = ["latency", "code", "json_body", "html_body"].map(
  (type) => ({
    label: checkTypeToDisplayString[type],
    value: type,
    isDisabled: false,
  })
);

const timingPhaseOptionsToDisplayString: { [key: string]: string } = {
  dns: "DNS lookup after socket assignment",
  tcp: "Time to establish TCP",
  tls: "Time to establish TLS",
  request: "Time to send request after TLS",
  firstByte: "Time to first byte after request sent",
  download: "Response download time",
  total: "Total request time",
};

const timingPhaseOptions = [
  "dns",
  "tcp",
  "tls",
  "request",
  "firstByte",
  "download",
  "total",
].map((phase) => ({
  label: timingPhaseOptionsToDisplayString[phase],
  value: phase,
  isDisabled: false,
}));

const numericalComparisonOptionsToDisplayString: { [key: string]: string } = {
  equal: "equals",
  greater: "is greater than",
  less: "is less than",
  greater_or_equal: "is greater than or equal to",
  less_or_equal: "is less than or equal to",
  not_equal: "is not equal to",
};

const numericalComparisonOptions = [
  "equal",
  "not_equal",
  "greater",
  "less",
  "greater_or_equal",
  "less_or_equal",
].map((comp) => ({
  label: numericalComparisonOptionsToDisplayString[comp],
  value: comp,
  isDisabled: false,
}));

const jsonComparisonOptionsToDisplayString: { [key: string]: string } = {
  ...numericalComparisonOptionsToDisplayString,
  null: "is null",
  not_null: "is not null",
  empty: "is empty",
  not_empty: "is not empty",
  contains: "contains",
  not_contains: "does not contain",
};

const jsonComparisonOptions = [
  "equal",
  "not_equal",
  "greater",
  "less",
  "greater_or_equal",
  "less_or_equal",
  "null",
  "not_null",
  "empty",
  "not_empty",
  "contains",
  "not_contains",
].map((comp) => ({
  label: jsonComparisonOptionsToDisplayString[comp],
  value: comp,
  isDisabled: false,
}));

const getValueTypeForJsonCheck = (comparison: JsonOperators) => {
  switch (comparison) {
    case "contains":
      return "string";
    case "empty":
      return "none";
    case "equal":
      return "any";
    case "greater":
      return "number";
    case "greater_or_equal":
      return "number";
    case "less":
      return "number";
    case "less_or_equal":
      return "number";
    case "not_contains":
      return "string";
    case "not_empty":
      return "none";
    case "not_equal":
      return "any";
    case "not_null":
      return "none";
    case "null":
      return "none";
  }
};

const htmlComparisonOptionsToDisplayString: { [key: string]: string } = {
  contains: "contains",
  not_contains: "does not contain",
};

const htmlComparisonOptions = ["contains", "not_contains"].map((comp) => ({
  label: htmlComparisonOptionsToDisplayString[comp],
  value: comp,
  isDisabled: false,
}));

export const ConnectForm = ({
  children,
}: {
  children: React.FC<UseFormReturn<Inputs, object>>;
}) => {
  const methods = useFormContext<Inputs>();

  return children({ ...methods });
};

interface UpConditionCheckFieldProps {
  index: number;
  remove: (index?: number | number[] | undefined) => void;
}

export const UpConditionCheckField = ({
  index,
  remove,
}: UpConditionCheckFieldProps) => {
  const fieldMarginTop = ["12px", null, null, 0];
  return (
    <ConnectForm>
      {({ control, setValue, watch, resetField }) => {
        return (
          <Flex flexDir={["column", "column", null, "row"]}>
            <Controller
              control={control}
              name={`up_condition_checks.${index}.type`}
              rules={{ required: "Check type is required." }}
              render={({ field, fieldState }) => (
                <FormControl
                  mr="10px"
                  isInvalid={fieldState.error !== undefined}
                  maxW={["full", null, null, "2xs"]}
                >
                  <FormLabel>Check Type</FormLabel>
                  <ReactSelect
                    options={checkTypeOptions}
                    placeholder="Select Check Type"
                    field={field as any}
                    // reset the field to avoid sending data from other field types
                    setValue={(name: string, opt: any) => {
                      resetField(`up_condition_checks.${index}`);
                      setValue(name as any, opt);
                    }}
                  />
                  <FormErrorMessage>
                    {fieldState.error?.message}
                  </FormErrorMessage>
                </FormControl>
              )}
            />
            {watch(`up_condition_checks.${index}.type`) === "latency" && (
              <>
                <Controller
                  control={control}
                  name={`up_condition_checks.${index}.condition.property`}
                  rules={{ required: "Timing phase is required." }}
                  render={({ field, fieldState }) => (
                    <FormControl
                      mr="10px"
                      mt={fieldMarginTop}
                      isInvalid={fieldState.error !== undefined}
                    >
                      <FormLabel>Timing Phase</FormLabel>
                      <ReactSelect
                        options={timingPhaseOptions}
                        placeholder="Select Timing Phase"
                        field={field as any}
                        setValue={setValue}
                      />
                      <FormErrorMessage>
                        {fieldState.error?.message}
                      </FormErrorMessage>
                    </FormControl>
                  )}
                />
                <Controller
                  control={control}
                  name={`up_condition_checks.${index}.condition.comparison`}
                  rules={{ required: "Comparison is required." }}
                  render={({ field, fieldState }) => (
                    <FormControl
                      mr="10px"
                      isInvalid={fieldState.error !== undefined}
                      mt={fieldMarginTop}
                    >
                      <FormLabel>Comparison</FormLabel>
                      <ReactSelect
                        options={numericalComparisonOptions}
                        placeholder="Select Comparison"
                        field={field as any}
                        setValue={setValue}
                      />
                      <FormErrorMessage>
                        {fieldState.error?.message}
                      </FormErrorMessage>
                    </FormControl>
                  )}
                />
                <Controller
                  defaultValue={50}
                  control={control}
                  name={`up_condition_checks.${index}.condition.expected`}
                  rules={{ required: "Value is required." }}
                  render={({ field, fieldState }) => (
                    <FormControl
                      mr="10px"
                      isInvalid={fieldState.error !== undefined}
                      mt={fieldMarginTop}
                    >
                      <FormLabel>Value (in milliseconds)</FormLabel>
                      <NumberInput
                        defaultValue={50}
                        min={0}
                        {...field}
                        onChange={(s, n) =>
                          setValue(
                            `up_condition_checks.${index}.condition.expected`,
                            Number.isNaN(n) ? 0 : n
                          )
                        }
                      >
                        <NumberInputField h="38px" rounded="md" />
                        <NumberInputStepper>
                          <NumberIncrementStepper />
                          <NumberDecrementStepper />
                        </NumberInputStepper>
                      </NumberInput>
                      <FormErrorMessage>
                        {fieldState.error?.message}
                      </FormErrorMessage>
                    </FormControl>
                  )}
                />
              </>
            )}
            {watch(`up_condition_checks.${index}.type`) === "code" && (
              <>
                <Controller
                  control={control}
                  name={`up_condition_checks.${index}.condition.comparison`}
                  rules={{ required: "Comparison is required." }}
                  render={({ field, fieldState }) => (
                    <FormControl
                      mr="10px"
                      isInvalid={fieldState.error !== undefined}
                      mt={fieldMarginTop}
                    >
                      <FormLabel>Comparison</FormLabel>
                      <ReactSelect
                        options={numericalComparisonOptions}
                        placeholder="Select Comparison"
                        field={field as any}
                        setValue={setValue}
                      />
                      <FormErrorMessage>
                        {fieldState.error?.message}
                      </FormErrorMessage>
                    </FormControl>
                  )}
                />
                <Controller
                  defaultValue={200}
                  control={control}
                  name={`up_condition_checks.${index}.condition.expected`}
                  rules={{ required: "Value is required." }}
                  render={({ field, fieldState }) => (
                    <FormControl
                      mr="10px"
                      isInvalid={fieldState.error !== undefined}
                      mt={fieldMarginTop}
                    >
                      <FormLabel>Code</FormLabel>
                      <NumberInput
                        defaultValue={200}
                        min={0}
                        {...field}
                        onChange={(s, n) =>
                          setValue(
                            `up_condition_checks.${index}.condition.expected`,
                            Number.isNaN(n) ? 0 : n
                          )
                        }
                      >
                        <NumberInputField h="38px" rounded="md" />
                      </NumberInput>
                      <FormErrorMessage>
                        {fieldState.error?.message}
                      </FormErrorMessage>
                    </FormControl>
                  )}
                />
              </>
            )}
            {watch(`up_condition_checks.${index}.type`) === "json_body" && (
              <>
                <Controller
                  defaultValue=""
                  control={control}
                  name={`up_condition_checks.${index}.condition.property`}
                  rules={{
                    required: "JSON Path is required.",
                    maxLength: {
                      value: 200,
                      message:
                        "JSON path value must be 200 characters or less in length.",
                    },
                  }}
                  render={({ field, fieldState }) => (
                    <FormControl
                      mr="10px"
                      isInvalid={fieldState.error !== undefined}
                      mt={fieldMarginTop}
                    >
                      <FormLabel>JSON Path</FormLabel>
                      <Input {...field} placeholder="$.data.users[0].name" />
                      <FormErrorMessage>
                        {fieldState.error?.message}
                      </FormErrorMessage>
                    </FormControl>
                  )}
                />
                <Controller
                  control={control}
                  name={`up_condition_checks.${index}.condition.comparison`}
                  rules={{ required: "Comparison is required." }}
                  render={({ field, fieldState }) => (
                    <FormControl
                      mr="10px"
                      isInvalid={fieldState.error !== undefined}
                      mt={fieldMarginTop}
                    >
                      <FormLabel>Comparison</FormLabel>
                      <ReactSelect
                        options={jsonComparisonOptions}
                        placeholder="Select Comparison"
                        field={field as any}
                        // reset the field to avoid sending data from other field types
                        setValue={(name: string, opt: any) => {
                          resetField(
                            `up_condition_checks.${index}.condition.expected`
                          );
                          setValue(name as any, opt);
                        }}
                      />
                      <FormErrorMessage>
                        {fieldState.error?.message}
                      </FormErrorMessage>
                    </FormControl>
                  )}
                />
                {getValueTypeForJsonCheck(
                  watch(`up_condition_checks.${index}.condition.comparison`)
                ) === "none" && <></>}
                {getValueTypeForJsonCheck(
                  watch(`up_condition_checks.${index}.condition.comparison`)
                ) === "any" && (
                  <Controller
                    defaultValue=""
                    control={control}
                    name={`up_condition_checks.${index}.condition.expected`}
                    rules={{
                      required: "Value is required.",
                      maxLength: {
                        value: 200,
                        message:
                          "Expected value must be 200 characters or less in length.",
                      },
                    }}
                    render={({ field, fieldState }) => (
                      <FormControl
                        mr="10px"
                        isInvalid={fieldState.error !== undefined}
                        mt={fieldMarginTop}
                      >
                        <FormLabel>Value (number or string)</FormLabel>
                        <Input
                          {...field}
                          placeholder="Value"
                          // check if we got strings or numbers
                          onChange={(e) => {
                            if (Number.isNaN(Number(e.target.value))) {
                              setValue(
                                `up_condition_checks.${index}.condition.expected`,
                                e.target.value
                              );
                            } else {
                              setValue(
                                `up_condition_checks.${index}.condition.expected`,
                                Number(e.target.value)
                              );
                            }
                          }}
                        />
                        <FormErrorMessage>
                          {fieldState.error?.message}
                        </FormErrorMessage>
                      </FormControl>
                    )}
                  />
                )}
                {getValueTypeForJsonCheck(
                  watch(`up_condition_checks.${index}.condition.comparison`)
                ) === "number" && (
                  <Controller
                    defaultValue={0}
                    control={control}
                    name={`up_condition_checks.${index}.condition.expected`}
                    rules={{ required: "Value is required." }}
                    render={({ field, fieldState }) => (
                      <FormControl
                        mr="10px"
                        isInvalid={fieldState.error !== undefined}
                        mt={fieldMarginTop}
                      >
                        <FormLabel>Value (number)</FormLabel>
                        <NumberInput
                          defaultValue={0}
                          {...field}
                          onChange={(s, n) =>
                            setValue(
                              `up_condition_checks.${index}.condition.expected`,
                              Number.isNaN(n) ? 0 : n
                            )
                          }
                        >
                          <NumberInputField h="38px" rounded="md" />
                        </NumberInput>
                        <FormErrorMessage>
                          {fieldState.error?.message}
                        </FormErrorMessage>
                      </FormControl>
                    )}
                  />
                )}
                {getValueTypeForJsonCheck(
                  watch(`up_condition_checks.${index}.condition.comparison`)
                ) === "string" && (
                  <Controller
                    defaultValue=""
                    control={control}
                    name={`up_condition_checks.${index}.condition.expected`}
                    rules={{
                      required: "Value is required.",
                      maxLength: {
                        value: 200,
                        message:
                          "Expected value must be 200 characters or less in length.",
                      },
                    }}
                    render={({ field, fieldState }) => (
                      <FormControl
                        mr="10px"
                        isInvalid={fieldState.error !== undefined}
                        mt={fieldMarginTop}
                      >
                        <FormLabel>Value (string)</FormLabel>
                        <Input {...field} placeholder="Value" />
                        <FormErrorMessage>
                          {fieldState.error?.message}
                        </FormErrorMessage>
                      </FormControl>
                    )}
                  />
                )}
              </>
            )}
            {watch(`up_condition_checks.${index}.type`) === "html_body" && (
              <>
                <Controller
                  control={control}
                  name={`up_condition_checks.${index}.condition.comparison`}
                  rules={{ required: "Comparison is required." }}
                  render={({ field, fieldState }) => (
                    <FormControl
                      mr="10px"
                      isInvalid={fieldState.error !== undefined}
                      mt={fieldMarginTop}
                    >
                      <FormLabel>Comparison</FormLabel>
                      <ReactSelect
                        options={htmlComparisonOptions}
                        placeholder="Select Comparison"
                        field={field as any}
                        setValue={setValue}
                      />
                      <FormErrorMessage>
                        {fieldState.error?.message}
                      </FormErrorMessage>
                    </FormControl>
                  )}
                />
                <Controller
                  defaultValue=""
                  control={control}
                  name={`up_condition_checks.${index}.condition.expected`}
                  rules={{
                    required: "Value is required.",
                    maxLength: {
                      value: 500,
                      message:
                        "Expected value must be 500 characters or less in length.",
                    },
                  }}
                  render={({ field, fieldState }) => (
                    <FormControl
                      mr="10px"
                      isInvalid={fieldState.error !== undefined}
                      mt={fieldMarginTop}
                    >
                      <FormLabel>Value (string)</FormLabel>
                      <Input {...field} placeholder="Value" />
                      <FormErrorMessage>
                        {fieldState.error?.message}
                      </FormErrorMessage>
                    </FormControl>
                  )}
                />
              </>
            )}
            <IconButton
              aria-label="delete header"
              icon={<DeleteIcon />}
              colorScheme="red"
              color="white"
              bg="red.500"
              fontWeight="medium"
              _hover={{ bg: "red.600" }}
              onClick={() => remove(index)}
              mt="32px"
            >
              Delete
            </IconButton>
          </Flex>
        );
      }}
    </ConnectForm>
  );
};

interface UpConditionCheckFieldsProps {
  fields: FieldArrayWithId<Inputs, "up_condition_checks", "id">[];
  append: (
    value: Partial<UpConditionCheck> | Partial<UpConditionCheck>[],
    options?: FieldArrayMethodProps | undefined
  ) => void;
  remove: (index?: number | number[] | undefined) => void;
}

const NewCheckButton = ({
  append,
  disabled,
}: Pick<UpConditionCheckFieldsProps, "append"> & { disabled: boolean }) => (
  <Button
    mt="1em"
    colorScheme="gray"
    color="white"
    bg="gray.400"
    fontWeight="medium"
    _hover={{ bg: "blue.600" }}
    isDisabled={disabled}
    onClick={() => {
      append({});
    }}
  >
    Add New Check
  </Button>
);

export const UpConditionCheckFields = ({
  fields,
  append,
  remove,
}: UpConditionCheckFieldsProps) => {
  const limit = 10;
  const borderColor = useColorModeValue("gray.200", "whiteAlpha.400");
  return (
    <>
      <FormControl>
        <FormLabel
          htmlFor="up_condition_checks"
          display="flex"
          alignItems="center"
        >
          Checks
          <chakra.span
            color={fields.length === limit ? "red.500" : "inherit"}
            mr="5px"
            ml="3px"
          >
            ({`${fields.length}/10`})
          </chakra.span>
          <Tooltip
            aria-label="Up condition information"
            label="Up condition checks if a website is up or not. If no checks are specified, the monitor will check for a 200 OK response."
          >
            <QuestionOutlineIcon boxSize={5} />
          </Tooltip>
        </FormLabel>
        {fields.map((item, index) => {
          return (
            <Box
              key={item.id}
              py="1em"
              borderBottom="1px"
              borderColor={borderColor}
            >
              <Heading fontSize="md" fontWeight="normal">
                Check {index + 1}
              </Heading>
              <UpConditionCheckField index={index} remove={remove} />
            </Box>
          );
        })}
        <NewCheckButton append={append} disabled={fields.length === limit} />
      </FormControl>
    </>
  );
};
