import {
  Button,
  ButtonProps,
  Popover,
  PopoverContent,
  PopoverContentProps,
  PopoverTrigger,
  SimpleGrid,
  SimpleGridProps,
  useColorModeValue,
} from "@chakra-ui/react";
import { IoIosArrowDown } from "react-icons/io";
import React from "react";
import { DropDownMenuProps } from "./navigation";
import { overrideStyles } from "@hyper-next/react-utils";

export const DropDownMenu = (props: DropDownMenuProps) => {
  const { buttonText, mainColumnLinks, responsiveColumns, styles } = props;

  const defaultDropDownButtonStyles: ButtonProps = {
    color: "gray.500",
    display: "inline-flex",
    alignItems: "center",
    fontSize: "md",
    variant: "ghost",
    _focus: { boxShadow: "none" },
    rightIcon: <IoIosArrowDown />,
    _hover: { color: useColorModeValue("gray.800", "white") },
  };

  const defaultLinkColumnGridContainerStyles: SimpleGridProps = {
    columns:
      responsiveColumns && mainColumnLinks.length >= 4
        ? {
            base: 1,
            md: Math.floor(mainColumnLinks.length / 2),
          }
        : 1,
    position: "relative",
    gap: { base: 3, sm: 4 },
    px: 3,
    py: 3,
    p: { sm: 4 },
  };

  const defaultDropDownContainerStyles: PopoverContentProps = {
    w: "100vw",
    maxW: responsiveColumns ? { base: "sm", md: "md", lg: "50vw" } : "md",
    _focus: { boxShadow: "md" },
  };

  return (
    <Popover>
      <PopoverTrigger>
        <Button
          {...overrideStyles(
            defaultDropDownButtonStyles,
            styles?.dropDownButtonProps
          )}
        >
          {buttonText}
        </Button>
      </PopoverTrigger>
      <PopoverContent
        {...overrideStyles(
          defaultDropDownContainerStyles,
          styles?.dropDownContainerStyles
        )}
      >
        <SimpleGrid
          {...overrideStyles(
            defaultLinkColumnGridContainerStyles,
            styles?.linkColumnGridContainerProps
          )}
        >
          {mainColumnLinks.map((link) => link)}
        </SimpleGrid>
      </PopoverContent>
    </Popover>
  );
};
