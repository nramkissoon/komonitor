import React from "react";
import Link from "next/link";
import { LeftIconLinkProps } from "../navigation";
import {
  Box,
  BoxProps,
  chakra,
  HTMLChakraProps,
  useColorModeValue,
} from "@chakra-ui/react";
import { overrideStyles } from "../../theme/utils";

export const LeftIconLink = (props: LeftIconLinkProps) => {
  const { icon, text, href, styles } = props;

  const defaultBoxContainerStyles: BoxProps = {
    m: 0,
    p: 3,
    display: "flex",
    alignItems: "center",
    rounded: "md",
    fontSize: "md",
    color: useColorModeValue("gray.900", "gray.50"),
    _hover: {
      bg: useColorModeValue("gray.100", "gray.400"),
    },
  };

  const defaultIconBoxContainerStyles: BoxProps = {
    flexShrink: 0,
    h: 5,
    w: 5,
    "aria-hidden": true,
  };

  const defaultTextContainerStyles: HTMLChakraProps<"span"> = {
    ml: 3,
  };

  return (
    <Link href={href} passHref>
      <Box
        {...overrideStyles(
          defaultBoxContainerStyles,
          styles?.boxContainerProps
        )}
      >
        <Box
          {...overrideStyles(
            defaultIconBoxContainerStyles,
            styles?.iconBoxContainerProps
          )}
        >
          {icon}
        </Box>
        <chakra.span
          {...overrideStyles(defaultTextContainerStyles, styles?.textProps)}
        >
          {text}
        </chakra.span>
      </Box>
    </Link>
  );
};
