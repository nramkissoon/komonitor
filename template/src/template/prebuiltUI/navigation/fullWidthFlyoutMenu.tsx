import { Box, SimpleGrid } from "@chakra-ui/layout";
import {
  BoxProps,
  Button,
  ButtonProps,
  SimpleGridProps,
  useColorModeValue,
} from "@chakra-ui/react";
import React from "react";
import { IoIosArrowDown } from "react-icons/io";
import { overrideStyles } from "../theme/utils";
import { FullWidthFlyoutMenuProps } from "./navigation";

export const FullWidthFlyoutMenu = (props: FullWidthFlyoutMenuProps) => {
  const { buttonText, links, styles } = props;

  const defaultFlyoutButtonStyles: ButtonProps = {
    color: "gray.500",
    display: "inline-flex",
    alignItems: "center",
    fontSize: "md",
    variant: "ghost",
    _focus: { boxShadow: "none" },
    rightIcon: <IoIosArrowDown />,
    _hover: { color: useColorModeValue("gray.800", "white") },
    py: "1.5em",
  };

  const defaultFlyoutBoxContainerStyles: BoxProps = {
    position: "absolute",
    left: 0,
    w: "full",
    display: "none",
    shadow: "sm",
    bg: useColorModeValue("white", "gray.700"),
    _groupHover: { display: "block" },
    zIndex: "dropdown",
  };

  const defaultLinkGridContainerStyles: SimpleGridProps = {
    columns: { base: 1, md: 3, lg: 5 },
    position: "relative",
    gap: { base: 3, sm: 4 },
    px: 3,
    py: 3,
    p: { sm: 4 },
  };

  return (
    <Box role="group">
      <Button
        {...overrideStyles(
          defaultFlyoutButtonStyles,
          styles?.flyoutButtonProps
        )}
      >
        {buttonText}
      </Button>
      <Box
        {...overrideStyles(
          defaultFlyoutBoxContainerStyles,
          styles?.flyoutBoxContainerProps
        )}
      >
        <SimpleGrid
          {...overrideStyles(
            defaultLinkGridContainerStyles,
            styles?.linkGridContainerProps
          )}
        >
          {links.map((link) => link)}
        </SimpleGrid>
      </Box>
    </Box>
  );
};
