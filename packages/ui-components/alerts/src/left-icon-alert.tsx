import {
  As,
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
import { overrideStyles } from "@hyper-next/react-utils";

export interface LeftIconAlertProps {
  icon: As<any> | undefined;
  header: string;
  subheader: string;
  subComponentsProps?: {
    flexContainerPropsL0?: FlexProps;
    iconFlexContainerPropsL1?: FlexProps;
    iconPropsL2?: IconProps;
    textBoxContainerPropsL1?: BoxProps;
    headerPropsL2?: HTMLChakraProps<"span">;
    subheaderPropsL2?: HTMLChakraProps<"p">;
  };
}

export const LeftIconAlert = (props: LeftIconAlertProps) => {
  const { icon, header, subheader, subComponentsProps } = props;

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
      {...overrideStyles(
        defaultFlexContainerProps,
        subComponentsProps?.flexContainerPropsL0
      )}
    >
      <Flex
        {...overrideStyles(
          defaultIconFlexContainerProps,
          subComponentsProps?.iconFlexContainerPropsL1
        )}
      >
        <Icon
          as={icon}
          {...overrideStyles(defaultIconProps, subComponentsProps?.iconPropsL2)}
        />
      </Flex>
      <Box
        {...overrideStyles(
          defaultTextBoxContainerProps,
          subComponentsProps?.textBoxContainerPropsL1
        )}
      >
        <Box mx={3}>
          <chakra.span
            {...overrideStyles(
              defaultHeaderProps,
              subComponentsProps?.headerPropsL2
            )}
          >
            {header}
          </chakra.span>
          <chakra.p
            {...overrideStyles(
              defaultSubheaderProps,
              subComponentsProps?.subheaderPropsL2
            )}
          >
            {subheader}
          </chakra.p>
        </Box>
      </Box>
    </Flex>
  );
};
