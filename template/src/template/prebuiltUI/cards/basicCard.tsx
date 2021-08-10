import {
  Box,
  Flex,
  chakra,
  FlexProps,
  HTMLChakraProps,
  useColorModeValue,
} from "@chakra-ui/react";
import React from "react";
import { overrideStyles } from "../theme/utils";
import { BasicCardProps } from "./card";

export const BasicCard = (props: BasicCardProps) => {
  const { icon, title, body, styles } = props;

  const defaultIconFlexContainerStyles: FlexProps = {
    alignItems: "center",
    justifyContent: "center",
    w: 5,
    h: 5,
    mb: 4,
    rounded: "full",
  };

  const defaultTitleStyles: HTMLChakraProps<"h3"> = {
    mb: 2,
    fontWeight: "semibold",
    lineHeight: "shorter",
    color: useColorModeValue("gray.900", "white"),
  };

  const defaultBodyStyles: HTMLChakraProps<"p"> = {
    fontSize: "sm",
    color: useColorModeValue("gray.500", "gray.400"),
  };

  return (
    <Box>
      <Flex
        {...overrideStyles(
          defaultIconFlexContainerStyles,
          styles?.iconFlexContainerProps
        )}
      >
        {icon ? <>{icon}</> : <></>}
      </Flex>
      <chakra.h3 {...overrideStyles(defaultTitleStyles, styles?.titleProps)}>
        {title}
      </chakra.h3>
      <chakra.p {...overrideStyles(defaultBodyStyles, styles?.bodyProps)}>
        {body}
      </chakra.p>
    </Box>
  );
};
