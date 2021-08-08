import {
  BoxProps,
  CloseButtonProps,
  HTMLChakraProps,
  PopoverContentProps,
  SimpleGridProps,
  StackProps,
} from "@chakra-ui/react";
import React from "react";

export interface SectionLinkProps {
  title: string;
  body: string;
  href: string;
  icon?: React.ReactNode;
  styles?: {
    boxContainerProps?: BoxProps;
    iconBoxContainerProps?: BoxProps;
    textBoxContainerStyles?: BoxProps;
    titleProps?: HTMLChakraProps<"p">;
    bodyProps?: HTMLChakraProps<"p">;
  };
}

export interface LeftIconLinkProps {
  icon: React.ReactNode;
  text: string;
  href: string;
  styles?: {
    boxContainerProps?: BoxProps;
    iconBoxContainerProps?: BoxProps;
    textProps?: HTMLChakraProps<"span">;
  };
}

export interface SlideMobileNavigationProps {
  isOpen: boolean;
  onClose: MouseEventHandler<HTMLButtonElement>;
  links: React.ReactNode[];
  styles?: {
    slideTransitionProps?: SlideProps;
    vstackContainerProps?: StackProps;
    closeButtonProps?: CloseButtonProps;
  };
}

export interface DropDownMenuProps {
  buttonText: string;
  mainColumnLinks: React.ReactNode[];
  responsiveColumns?: boolean;
  styles?: {
    dropDownButtonProps?: ButtonProps;
    linkColumnGridContainerProps?: SimpleGridProps;
    dropDownContainerStyles?: PopoverContentProps;
  };
}

export interface FullWidthFlyoutMenuProps {
  buttonText: string;
  links: React.ReactNode[];
  styles?: {
    flyoutButtonProps?: ButtonProps;
    flyoutBoxContainerProps?: BoxProps;
    linkGridContainerProps?: SimpleGridProps;
  };
}

export interface SimpleLinkProps {
  text: string;
  href: string;
  styles?: {
    buttonLinkStyles?: ButtonProps;
  };
}
