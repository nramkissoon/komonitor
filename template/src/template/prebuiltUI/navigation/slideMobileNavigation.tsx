import {
  CloseButton,
  CloseButtonProps,
  Slide,
  SlideProps,
  StackProps,
  VStack,
} from "@chakra-ui/react";
import React from "react";
import { overrideStyles } from "../theme/utils";
import { SlideMobileNavigationProps } from "./navigation";

export const SlideMobileNavigation = (props: SlideMobileNavigationProps) => {
  const { isOpen, onClose, links, styles } = props;

  const defaultSlideTransitionStyles: SlideProps = {
    direction: "right",
    style: { zIndex: 10 },
    in: isOpen,
  };

  const defaultVstackContainerStyles: StackProps = {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    flexDirection: "column",
    p: 2,
    pb: 4,
    m: 2,
    bg: "white",
    rounded: "md",
    shadow: "sm",
  };

  const defaultCloseButtonStyles: CloseButtonProps = {
    "aria-label": "Close menu",
    justifySelf: "self-start",
    onClick: onClose,
  };

  return (
    <Slide
      {...overrideStyles(
        defaultSlideTransitionStyles,
        styles?.slideTransitionProps
      )}
    >
      <VStack
        {...overrideStyles(
          defaultVstackContainerStyles,
          styles?.vstackContainerProps
        )}
      >
        <CloseButton
          {...overrideStyles(
            defaultCloseButtonStyles,
            styles?.closeButtonProps
          )}
        />
        {links.map((link) => link)}
      </VStack>
    </Slide>
  );
};
