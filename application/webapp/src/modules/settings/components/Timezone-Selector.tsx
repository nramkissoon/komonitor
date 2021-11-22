import { Flex, useColorModeValue, useToken } from "@chakra-ui/react";
import React from "react";
import TimezoneSelect from "react-timezone-select";
import { allTimezones } from "../../../common/utils";
import { updateTimezonePreference } from "../client";
import { SaveButton } from "./Save-Button";

interface TimezoneSelectorProps {
  initialTz: string;
}

export function TimezoneSelector(props: TimezoneSelectorProps) {
  const { initialTz } = props;
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

  const [selectedTimezone, setSelectedTimezone] = React.useState(
    initialTz as any
  );

  return (
    <Flex justifyContent="space-between" width="100%" mb="1em">
      <TimezoneSelect
        value={selectedTimezone}
        onChange={setSelectedTimezone}
        timezones={allTimezones}
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
      />
      <SaveButton
        postFunction={updateTimezonePreference}
        initialData={initialTz}
        newData={selectedTimezone}
        mutateApi={"/api/user/tz"}
      />
    </Flex>
  );
}
