import { Box, Flex, FlexProps, Heading, HeadingProps } from "@chakra-ui/layout";
import { Button, ButtonProps } from "@chakra-ui/react";
import React from "react";
import { overrideStyles } from "../theme/utils";
import { SimpleSignUpCtaSectionProps } from "./ctaSection";

export const SimpleSignUpCtaSection = (props: SimpleSignUpCtaSectionProps) => {
  const { header, subheader, ctaButtonProps, styles } = props;
  const { isAuthed, buttonText, authRoute, appRoute } = ctaButtonProps;

  const defaultFlexContainerStyles: FlexProps = {
    w: "100vw",
    py: ".5em",
    my: "5em",
    px: ["5vw", "5vw", "10vw", "15vw", "20vw"],
    display: "flex",
    flexWrap: "wrap",
    flexDirection: "column",
    alignItems: "center",
  };

  const defaultHeadingProps: HeadingProps = {
    as: "h2",
    size: "3xl",
    textAlign: "center",
  };

  const defaultSubheadingProps: HeadingProps = {
    as: "h3",
    size: "lg",
    textAlign: "center",
    color: "gray.600",
    mt: ".3em",
  };

  const defaultCtaButtonProps: ButtonProps = {
    size: "lg",
    as: "a",
    mt: "1.8em",
    shadow: "md",
    px: "2em",
  };

  return (
    <Flex
      {...overrideStyles(
        defaultFlexContainerStyles,
        styles?.flexContainerProps
      )}
    >
      <Box>
        <Heading {...overrideStyles(defaultHeadingProps, styles?.headingProps)}>
          {header}
        </Heading>
      </Box>
      {subheader ? (
        <Box>
          <Heading
            {...overrideStyles(defaultSubheadingProps, styles?.subheadingProps)}
          >
            {subheader}
          </Heading>
        </Box>
      ) : (
        <></>
      )}
      <Box>
        <Button
          href={isAuthed ? appRoute : authRoute}
          {...overrideStyles(defaultCtaButtonProps, styles?.ctaButtonProps)}
        >
          {isAuthed ? buttonText.authed : buttonText.notAuthed}
        </Button>
      </Box>
    </Flex>
  );
};