import {
  Badge,
  BadgeProps,
  Box,
  BoxProps,
  Button,
  ButtonProps,
  chakra,
  Flex,
  FlexProps,
  HTMLChakraProps,
  StackProps,
  Text,
  TextProps,
  useColorModeValue,
  VStack,
} from "@chakra-ui/react";
import { overrideStyles } from "../theme/utils";
import { FancyPricingCardProps } from "./card";

export const FancyPricingCard = (props: FancyPricingCardProps) => {
  const {
    productTitle,
    price,
    pricePeriod,
    buttonOnClick,
    buttonText,
    featureItems,
    description,
    styles,
  } = props;

  const defaultBoxContainerProps: BoxProps = {
    bg: useColorModeValue("white", "gray.800"),
    pt: 10,
    shadow: "lg",
    rounded: "md",
  };

  const defaultTopSectionBoxContainerProps: BoxProps = {
    px: 10,
    pb: 5,
  };

  const defaultProductTitleBadgeProps: BadgeProps = {
    mb: 1,
    fontSize: "sm",
    letterSpacing: "wide",
    colorScheme: "gray",
    fontWeight: "medium",
    rounded: "full",
    px: 4,
    py: 1,
  };

  const defaultPriceNumberProps: TextProps = {
    mb: "2",
    fontSize: "5xl",
    fontWeight: ["bold", "extrabold"],
    color: useColorModeValue("gray.900", "gray.50"),
    lineHeight: "short",
  };

  const defaultPricePeriodProps: HTMLChakraProps<"span"> = {
    fontSize: "2xl",
    fontWeight: "medium",
    color: useColorModeValue("gray.600", "gray.400"),
  };

  const defaultDescriptionProps: HTMLChakraProps<"p"> = {
    mb: 6,
    fontSize: "md",
    color: useColorModeValue("gray.500", "gray.500"),
  };

  const defaultBottomSectionFlexContainerProps: FlexProps = {
    px: 10,
    pt: 5,
    pb: 10,
    direction: "column",
    bg: useColorModeValue("gray.50", "gray.900"),
    roundedBottom: "md",
  };

  const defaultFeatureVstackContainerProps: StackProps = {
    mb: 5,
    spacing: 4,
  };

  const defaultButtonProps: ButtonProps = {
    w: "full",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    px: 5,
    py: 3,
    fontWeight: "semibold",
    rounded: "md",
    shadow: "md",
    color: "white",
    bg: useColorModeValue("gray.800", "gray.500"),
    _hover: {
      bg: useColorModeValue("gray.700", "gray.600"),
    },
  };

  return (
    <Box
      {...overrideStyles(defaultBoxContainerProps, styles?.boxContainerProps)}
    >
      <Flex direction="column">
        <Box
          {...overrideStyles(
            defaultTopSectionBoxContainerProps,
            styles?.topSectionBoxContainerProps
          )}
        >
          <Badge
            {...overrideStyles(
              defaultProductTitleBadgeProps,
              styles?.productTitleBadgeProps
            )}
          >
            {productTitle}
          </Badge>
          <Text
            {...overrideStyles(
              defaultPriceNumberProps,
              styles?.priceNumberProps
            )}
          >
            {price}
            {pricePeriod ? (
              <chakra.span
                {...overrideStyles(
                  defaultPricePeriodProps,
                  styles?.pricePeriodProps
                )}
              >
                {" "}
                /{pricePeriod}{" "}
              </chakra.span>
            ) : (
              <></>
            )}
          </Text>
          {description ? (
            <chakra.p
              {...overrideStyles(
                defaultDescriptionProps,
                styles?.descriptionProps
              )}
            >
              {description}
            </chakra.p>
          ) : (
            <></>
          )}
        </Box>
        <Flex
          {...overrideStyles(
            defaultBottomSectionFlexContainerProps,
            styles?.bottomSectionFlexContainerProps
          )}
        >
          <VStack
            {...overrideStyles(
              defaultFeatureVstackContainerProps,
              styles?.featureVstackContainerProps
            )}
          >
            {featureItems.map((item) => item)}
          </VStack>
          <Button {...overrideStyles(defaultButtonProps, styles?.buttonProps)}>
            {buttonText}
          </Button>
        </Flex>
      </Flex>
    </Box>
  );
};
