import {
  HStack,
  VStack,
  chakra,
  Flex,
  Box,
  FlexProps,
  useColorModeValue,
  StackProps,
  HTMLChakraProps,
  BoxProps,
  ButtonProps,
  Button,
} from "@chakra-ui/react";
import React from "react";
import { overrideStyles } from "../theme/utils";
import { BasicPricingCardProps } from "./card";

export const BasicPricingCard = (props: BasicPricingCardProps) => {
  const {
    productTitle,
    price,
    pricePeriod,
    buttonOnClick,
    buttonText,
    featureItems,
    styles,
  } = props;

  const defaultFlexContainerProps: FlexProps = {
    flex: { sm: 1, lg: "initial" },
    rounded: "lg",
    bg: useColorModeValue("white", "gray.700"),
    my: 6,
    direction: "column",
  };

  const defaultVstackContainerProps: StackProps = {
    spacing: 1,
    justifyContent: "center",
    p: 8,
    textAlign: "center",
    w: "full",
    shadow: "xl",
  };

  const defaultProductTitleProps: HTMLChakraProps<"span"> = {
    fontSize: "3xl",
    fontWeight: "bold",
  };

  const defaultPriceHstackContainerProps: StackProps = {
    spacing: 3,
  };

  const defaultPriceNumberProps: HTMLChakraProps<"span"> = {
    fontWeight: "bold",
    fontSize: "6xl",
    textShadow: "2px 0 currentcolor",
  };

  const defaultPricePeriodProps: HTMLChakraProps<"span"> = {
    alignSelf: "center",
    fontSize: "3xl",
    color: "gray.400",
  };

  const defaultBottomSectionVstackContainerProps: StackProps = {
    fontSize: "sm",
    spacing: 8,
    h: "full",
    bg: useColorModeValue("gray.100", "gray.800"),
    borderLeftRadius: "lg",
    p: 12,
  };

  const defaultFeaturesVstackContainerProps: StackProps = {
    spacing: 4,
    w: "full",
    direction: "column",
    alignItems: "start",
  };

  const defaultButtonBoxContainerProps: BoxProps = {
    w: "full",
    ml: 3,
    display: "inline-flex",
    rounded: "md",
    shadow: "md",
  };

  const defaultButtonProps: ButtonProps = {
    w: "full",
    display: "inline-flex",
    alignItems: "center",
    rounded: "md",
    color: useColorModeValue("gray.900", "gray.100"),
    bg: useColorModeValue("white", "gray.600"),
    _hover: { bg: useColorModeValue("gray.50", "gray.700") },
    onClick: buttonOnClick,
  };

  return (
    <Flex
      {...overrideStyles(defaultFlexContainerProps, styles?.flexContainerProps)}
    >
      <VStack
        {...overrideStyles(
          defaultVstackContainerProps,
          styles?.vstackContainerProps
        )}
      >
        <chakra.span
          {...overrideStyles(
            defaultProductTitleProps,
            styles?.productTitleProps
          )}
        >
          {productTitle}
        </chakra.span>
        <HStack
          {...overrideStyles(
            defaultPriceHstackContainerProps,
            styles?.priceHstackContainerProps
          )}
        >
          <chakra.span
            {...overrideStyles(
              defaultPriceNumberProps,
              styles?.priceNumberProps
            )}
          >
            {price}
          </chakra.span>
          {pricePeriod ? (
            <chakra.span
              {...overrideStyles(
                defaultPricePeriodProps,
                styles?.pricePeriodProps
              )}
            >
              /{pricePeriod}
            </chakra.span>
          ) : (
            <></>
          )}
        </HStack>
      </VStack>
      <VStack
        {...overrideStyles(
          defaultBottomSectionVstackContainerProps,
          styles?.bottomSectionVstackContainerProps
        )}
      >
        <VStack
          {...overrideStyles(
            defaultFeaturesVstackContainerProps,
            styles?.featureVstackContainerProps
          )}
        >
          {featureItems.map((item) => item)}
        </VStack>
        <Box
          {...overrideStyles(
            defaultButtonBoxContainerProps,
            styles?.buttonBoxContainerProps
          )}
        >
          <Button {...overrideStyles(defaultButtonProps, styles?.buttonProps)}>
            {buttonText}
          </Button>
        </Box>
      </VStack>
    </Flex>
  );
};
