import {
  BoxProps,
  CloseButtonProps,
  HTMLChakraProps,
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
