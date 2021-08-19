import React from "react";
import {
  useColorModeValue,
  Box,
  chakra,
  BoxProps,
  HTMLChakraProps,
} from "@chakra-ui/react";
import Link from "next/link";
import { SectionLinkProps } from "../navigation";
import { overrideStyles } from "@hyper-next/react-utils";

export const SectionLink = (props: SectionLinkProps) => {
  const { title, body, href, icon, styles } = props;

  const defaultBoxContainerStyles: BoxProps = {
    m: 0,
    p: 3,
    display: "flex",
    rounded: "lg",
    _hover: { bg: useColorModeValue("gray.50", "gray.400"), cursor: "pointer" },
  };

  const defaultIconBoxContainerStyles: BoxProps = {
    flexShrink: 0,
    h: 5,
    w: 5,
    "aria-hidden": true,
  };

  const defaultTextContainerStyles: BoxProps = {
    ml: 3,
  };

  const defaultTitleStyles: HTMLChakraProps<"p"> = {
    fontSize: "sm",
    fontWeight: "700",
    color: useColorModeValue("gray.900", "gray.50"),
  };

  const defaultBodyStyles: HTMLChakraProps<"p"> = {
    fontSize: "sm",
    color: useColorModeValue("gray.900", "gray.50"),
  };

  return (
    <Link href={href} passHref>
      <Box
        {...overrideStyles(
          defaultBoxContainerStyles,
          styles?.boxContainerProps
        )}
      >
        {icon ? (
          <Box
            {...overrideStyles(
              defaultIconBoxContainerStyles,
              styles?.iconBoxContainerProps
            )}
          >
            {icon}
          </Box>
        ) : (
          <></>
        )}
        <Box
          {...overrideStyles(
            defaultTextContainerStyles,
            styles?.textBoxContainerStyles
          )}
        >
          <chakra.p {...overrideStyles(defaultTitleStyles, styles?.titleProps)}>
            {title}
          </chakra.p>
          <chakra.p {...overrideStyles(defaultBodyStyles, styles?.bodyProps)}>
            {body}
          </chakra.p>
        </Box>
      </Box>
    </Link>
  );
};
