import {
  Box,
  BoxProps,
  chakra,
  Flex,
  FlexProps,
  HTMLChakraProps,
  Icon,
  IconProps,
  useColorModeValue,
} from "@chakra-ui/react";
import React from "react";
import { overrideStyles } from "../theme/utils";
import { LeftIconAlertProps } from "./alerts";

export const LeftIconAlert = (props: LeftIconAlertProps) => {
  const { icon, header, subheader, styles } = props;

  const defaultFlexContainerProps: FlexProps = {
    maxW: "sm",
    w: "full",
    mx: "auto",
    bg: useColorModeValue("white", "gray.800"),
    shadow: "md",
    rounded: "lg",
    overflow: "hidden",
  };

  const defaultIconFlexContainerProps: FlexProps = {
    justifyContent: "center",
    alignItems: "center",
    w: 12,
    bg: "gray.500",
  };

  const defaultIconProps: IconProps = {
    color: "white",
    boxSize: 6,
  };

  const defaultTextBoxContainerProps: BoxProps = {
    mx: -3,
    py: 2,
    px: 4,
  };

  const defaultHeaderProps: HTMLChakraProps<"span"> = {
    color: useColorModeValue("gray.500", "gray.400"),
    fontWeight: "bold",
  };

  const defaultSubheaderProps: HTMLChakraProps<"p"> = {
    fontSize: "sm",
    color: useColorModeValue("gray.600", "gray.200"),
  };

  return (
    <Flex
      {...overrideStyles(defaultFlexContainerProps, styles?.flexContainerProps)}
    >
      <Flex
        {...overrideStyles(
          defaultIconFlexContainerProps,
          styles?.iconFlexContainerProps
        )}
      >
        <Icon
          as={icon}
          {...overrideStyles(defaultIconProps, styles?.iconProps)}
        />
      </Flex>
      <Box
        {...overrideStyles(
          defaultTextBoxContainerProps,
          styles?.textBoxContainerProps
        )}
      >
        <Box mx={3}>
          <chakra.span
            {...overrideStyles(defaultHeaderProps, styles?.headerProps)}
          >
            {header}
          </chakra.span>
          <chakra.p
            {...overrideStyles(defaultSubheaderProps, styles?.subheaderProps)}
          >
            {subheader}
          </chakra.p>
        </Box>
      </Box>
    </Flex>
  );
};
