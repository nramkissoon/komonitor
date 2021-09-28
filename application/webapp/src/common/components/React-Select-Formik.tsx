import { CloseIcon } from "@chakra-ui/icons";
import { Button, useColorModeValue, useToken } from "@chakra-ui/react";
import { FieldInputProps, FormikFormProps } from "formik";
import React, { KeyboardEventHandler } from "react";
import Select, { ActionMeta, OnChangeValue } from "react-select";
import CreatableSelect from "react-select/creatable";

interface ReactSelectFormikProps {
  options: { value: string; label: string; isDisabled: boolean }[];
  placeholder: string;
  field: FieldInputProps<string>;
  form: FormikFormProps | any;
  isDisabled?: boolean;
}

export function ReactSelectFormik(props: ReactSelectFormikProps) {
  const { options, placeholder, field, form, isDisabled } = props;
  const [
    gray900,
    gray50,
    blue100,
    blue300,
    gray400,
    gray600,
    blue800,
    gray500,
    whiteAlpha400,
  ] = useToken("colors", [
    "gray.900",
    "gray.50",
    "blue.100",
    "blue.300",
    "gray.400",
    "gray.600",
    "blue.800",
    "gray.500",
    "whiteAlpha.400",
  ]);

  return (
    <Select
      styles={{
        control: (base, props) => ({
          ...base,
          background: "inherit",
          borderColor: "inherit",
          outline: "inherit",
        }),
        singleValue: (base, props) => ({
          ...base,
          color: props.isDisabled ? whiteAlpha400 : "inherit",
        }),
        menu: (base, props) => ({
          ...base,
          background: useColorModeValue(gray50, gray900),
        }),
        menuList: (base, props) => ({
          maxHeight: "300px",
          overflow: "auto",
          "::-webkit-scrollbar": {
            width: "10px",
            height: "10px",
          },
          "::-webkit-scrollbar-track": {
            width: "10px",
            height: "10px",
          },
          "::-webkit-scrollbar-thumb": {
            background: useColorModeValue("#E2E8F0", "#1A202C"),
          },
        }),
        option: (base, props) => ({
          ...base,
          color: props.isDisabled
            ? useColorModeValue(gray400, gray600)
            : !props.isSelected
            ? useColorModeValue("", "")
            : "white",
          background: props.isDisabled
            ? "transparent"
            : props.isSelected
            ? blue300
            : props.isFocused
            ? useColorModeValue(blue100, blue800)
            : "inherit",
          ":hover": {
            background: props.isDisabled
              ? "transparent"
              : props.isSelected
              ? blue300
              : useColorModeValue(blue100, blue800),
          },
          ":active": {
            background: props.isDisabled
              ? "transparent"
              : props.isSelected
              ? blue300
              : useColorModeValue(blue100, blue800),
          },
        }),
      }}
      placeholder={placeholder}
      options={options}
      name={field.name}
      value={
        options ? options.find((option) => option.value === field.value) : ""
      }
      onChange={(option: any) =>
        form.setFieldValue(field.name, option?.value ?? "")
      }
      isClearable
      onBlur={field.onBlur}
      isDisabled={isDisabled}
      isOptionDisabled={(
        option:
          | string
          | {
              value: string;
              label: string;
              isDisabled: boolean;
            }
      ) => (typeof option === "string" ? false : option.isDisabled)}
    />
  );
}

interface MultiButtonProps {
  value: string;
  delete: any;
}

function MultiButton(props: MultiButtonProps) {
  return (
    <Button
      colorScheme="gray"
      onClick={props.delete}
      size="sm"
      fontWeight="normal"
      py="2px"
      mr=".5em"
      borderRadius="md"
      variant="solid"
      _hover={{
        bg: "red.400",
      }}
      rightIcon={<CloseIcon boxSize="2" />}
    >
      {props.value}
    </Button>
  );
}

interface MultiSelectTextInputFormikProps {
  placeholder: string;
  field: FieldInputProps<string[]>;
  form: FormikFormProps | any;
  initialValue: string[];
  selectLimit: number;
  postErrorToast: (message: string) => void;
}

export function MultiSelectTextInput(props: MultiSelectTextInputFormikProps) {
  const {
    placeholder,
    field,
    form,
    initialValue,
    selectLimit,
    postErrorToast,
  } = props;
  const [gray400, whiteAlpha400] = useToken("colors", [
    "gray.400",
    "whiteAlpha.400",
  ]);

  const [inputValue, setInputValue] = React.useState("");
  const [value, setValue] = React.useState<{ label: string; value: string }[]>(
    initialValue && initialValue.length > 0
      ? initialValue.map((val) => createOption(val))
      : []
  );
  const checkValueAlreadyExists = (values: any[], value: any) => {
    return values.filter((val) => val.value === value).length > 0;
  };

  React.useEffect(() => {
    form.setFieldValue(
      field.name,
      value.map((item: any) => item.value)
    );
  }, [value]);

  const createOption = (label: string) => ({ label, value: label });
  const handleInputChange = (inputValue: string) => setInputValue(inputValue);

  const handleKeyDown: KeyboardEventHandler<HTMLDivElement> = (event) => {
    if (!inputValue) return;
    switch (event.key) {
      case "Enter":
      case "Tab":
        if (value.length < selectLimit) {
          if (checkValueAlreadyExists(value, inputValue)) {
            postErrorToast("Value already exists.");
            event.preventDefault();
            return;
          } else if (inputValue.length > 100) {
            postErrorToast("Recipient value must be 100 characters or less.");
            event.preventDefault();
            return;
          }
          setValue([...value, createOption(inputValue)]);
          setInputValue(""); // reset
          event.preventDefault();
        } else {
          postErrorToast(
            "Cannot add more recipients. " +
              `Limit of ${selectLimit} given account plan.`
          );
          setInputValue(""); // reset
          event.preventDefault();
        }
    }
  };

  return (
    <CreatableSelect
      styles={{
        control: (base, props) => ({
          ...base,
          background: "inherit",
          borderColor: "inherit",
          outline: "inherit",
        }),
        placeholder: (base, props) => ({
          ...base,
          color: useColorModeValue(gray400, whiteAlpha400),
        }),
        multiValue: (base, props) => ({
          ...base,
          color: "inherit",
        }),
        input: (base, props) => ({
          ...base,
          color: "inherit",
        }),
      }}
      components={{
        DropdownIndicator: null,
        MultiValue: (props) => {
          return MultiButton({
            value: props.data.value,
            delete: props.removeProps.onClick,
          });
        },
      }}
      isClearable
      isMulti
      menuIsOpen={false}
      placeholder={placeholder}
      options={value}
      onChange={(
        val: OnChangeValue<{ label: string; value: string }, true>,
        actionMeta: ActionMeta<{ label: string; value: string }>
      ) => {
        setValue(val as { label: string; value: string }[]);
      }}
      inputValue={inputValue}
      onInputChange={handleInputChange}
      onKeyDown={handleKeyDown}
      value={value}
      name={field.name}
    />
  );
}
