import { useColorModeValue, useToken } from "@chakra-ui/react";
import { FieldInputProps, FormikFormProps } from "formik";
import Select, { OptionTypeBase } from "react-select";

interface ReactSelectFormikProps {
  options: { value: string; label: string; isDisabled: boolean }[];
  placeholder: string;
  field: FieldInputProps<string>;
  form: FormikFormProps | any;
}

export function ReactSelectFormik(props: ReactSelectFormikProps) {
  const { options, placeholder, field, form } = props;
  const [gray900, gray50, blue100, blue300, gray400, gray600, blue800] =
    useToken("colors", [
      "gray.900",
      "gray.50",
      "blue.100",
      "blue.300",
      "gray.400",
      "gray.600",
      "blue.800",
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
          color: "inherit",
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
          background: props.isSelected ? blue300 : "",
          ":hover": {
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
        (options
          ? options.find((option) => option.value === field.value)
          : "") as OptionTypeBase
      }
      onChange={(option: any) => form.setFieldValue(field.name, option.value)}
      onBlur={field.onBlur}
      isOptionDisabled={(option) => option.isDisabled}
    />
  );
}
