import { CloseIcon } from "@chakra-ui/icons";
import { Button, useColorModeValue, useToken } from "@chakra-ui/react";
import React, { KeyboardEventHandler } from "react";
import { ControllerRenderProps, UseFormSetValue } from "react-hook-form";
import Select, { ActionMeta, OnChangeValue } from "react-select";
import CreatableSelect from "react-select/creatable";

interface ReactSelectProps {
  options: { value: string; label: string; isDisabled: boolean }[];
  placeholder: string;
  isDisabled?: boolean;
  field: ControllerRenderProps;
  setValue: UseFormSetValue<any>;
}

export function ReactSelect(props: ReactSelectProps) {
  const { options, placeholder, field, isDisabled, setValue } = props;
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

  const menuBackground = useColorModeValue(gray50, gray900);
  const menuListBackground = useColorModeValue("#E2E8F0", "#1A202C");
  const optionDisabledColor = useColorModeValue(gray400, gray600);
  const optionFocusedBackground = useColorModeValue(blue100, blue800);

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
          background: menuBackground,
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
            background: menuListBackground,
          },
        }),
        option: (base, props) => ({
          ...base,
          color: props.isDisabled
            ? optionDisabledColor
            : !props.isSelected
            ? ""
            : "white",
          background: props.isDisabled
            ? "transparent"
            : props.isSelected
            ? blue300
            : props.isFocused
            ? optionFocusedBackground
            : "inherit",
          ":hover": {
            background: props.isDisabled
              ? "transparent"
              : props.isSelected
              ? blue300
              : optionFocusedBackground,
          },
          ":active": {
            background: props.isDisabled
              ? "transparent"
              : props.isSelected
              ? blue300
              : optionFocusedBackground,
          },
        }),
      }}
      placeholder={placeholder}
      options={options}
      isClearable
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
      {...field}
      value={
        options ? options.find((option) => option.value === field.value) : ""
      }
      onChange={(option: any) => setValue(field.name, option?.value ?? "")}
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
  field: ControllerRenderProps;
  initialValue: string[];
  selectLimit: number;
  postErrorToast: (message: string) => void;
  setValue: UseFormSetValue<any>;
}

// TODO IDK IF THIS WORKS
export function MultiSelectTextInput(props: MultiSelectTextInputFormikProps) {
  const {
    placeholder,
    field,
    initialValue,
    selectLimit,
    postErrorToast,
    setValue: formSetValue,
  } = props;
  const [gray400, whiteAlpha400] = useToken("colors", [
    "gray.400",
    "whiteAlpha.400",
  ]);
  const createOption = (label: string) => ({ label, value: label });
  const handleInputChange = (inputValue: string) => setInputValue(inputValue);

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
    formSetValue(
      field.name,
      value.map((item: any) => item.value)
    );
  }, [value]);

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
        formSetValue(
          field.name,
          (val as { label: string; value: string }[]).map(
            (val: any) => val.value
          )
        );
      }}
      inputValue={inputValue}
      onInputChange={handleInputChange}
      onKeyDown={handleKeyDown}
      name={field.name}
      value={value}
    />
  );
}
