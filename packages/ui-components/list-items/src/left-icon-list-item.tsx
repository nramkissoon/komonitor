import {
  chakra,
  Flex,
  FlexProps,
  IconProps,
  Icon,
  HTMLChakraProps,
  useColorModeValue,
} from "@chakra-ui/react";
import React from "react";
import { overrideStyles } from "@hyper-next/react-utils";
import { LeftIconListItemProps } from "./list-items";

export const LeftIconListItem = (props: LeftIconListItemProps) => {
  const { styles, text, icon } = props;

  const defaultFlexContainerProps: FlexProps = {
    w: "full",
  };

  const defaultIconProps: IconProps = {
    boxSize: 5,
    mt: 1,
    mr: 2,
    color: "gray.500",
    viewBox: "0 0 20 20",
  };

  const defaultTextProps: HTMLChakraProps<"p"> = {
    fontSize: "lg",
    color: useColorModeValue("gray.600", "gray.400"),
  };

  return (
    <Flex
      {...overrideStyles(defaultFlexContainerProps, styles?.flexContainerProps)}
    >
      <Icon
        as={icon}
        {...overrideStyles(defaultIconProps, styles?.iconProps)}
      />
      <chakra.p {...overrideStyles(defaultTextProps, styles?.textProps)}>
        {text}
      </chakra.p>
    </Flex>
  );
};
