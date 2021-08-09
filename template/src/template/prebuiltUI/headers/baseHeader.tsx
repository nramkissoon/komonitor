import React from "react";
import { BaseHeaderProps } from "./header";
import {
  Box,
  BoxProps,
  chakra,
  Flex,
  FlexProps,
  HStack,
  HTMLChakraProps,
  IconButton,
  IconButtonProps,
  StackProps,
  useColorMode,
  useColorModeValue,
} from "@chakra-ui/react";
import { HiSun, HiMoon } from "react-icons/hi";
import { AiOutlineMenu } from "react-icons/ai";
import Link from "next/link";
import { overrideStyles } from "../theme/utils";

export const BaseHeader = (props: BaseHeaderProps) => {
  const {
    mobileNavigation,
    links,
    logo,
    loginButton,
    signInOrAppLink,
    styles,
  } = props;

  const { toggleColorMode: toggleMode } = useColorMode();
  const colorModeText = useColorModeValue("dark", "light");
  let darkIcon = HiMoon;
  let lightIcon = HiSun;

  if (styles?.colorModeToggleIcons) {
    darkIcon = styles.colorModeToggleIcons.darkIcon;
    lightIcon = styles.colorModeToggleIcons.lightIcon;
  }
  let SwitchIcon = useColorModeValue(darkIcon, lightIcon);

  const defaultHeaderContainerStyles: HTMLChakraProps<"header"> = {
    h: "full",
    w: "full",
    px: { base: 2, sm: 4 },
    py: 4,
    shadow: "sm",
  };

  const defaultFlexContainerStyles: FlexProps = {
    h: "full",
    w: "full",
    px: "6",
    alignItems: "center",
    justifyContent: "space-between",
  };

  const defaultLogoFlexContainerStyles: FlexProps = {
    align: "flex-start",
  };

  const defaultLogoBoxContainerStyles: BoxProps = {
    w: "2em",
  };

  const defaultLinksHstackContainerStyles: StackProps = {
    spacing: "9",
    display: mobileNavigation ? { base: "none", md: "flex" } : "flex",
  };

  const defaultRightSectionFlexContainerStyles: FlexProps = {
    justify: "flex-end",
    align: "center",
    color: "gray.400",
  };

  const defaultRightSectionHstackContainerStyles: StackProps = {
    spacing: "6",
    display: mobileNavigation ? { base: "none", md: "flex" } : "flex",
  };

  const defaultColorModeToggleStyles: IconButtonProps = {
    size: "md",
    fontSize: "1.8em",
    "aria-label": `Switch to ${colorModeText} mode`,
    variant: "ghost",
    color: useColorModeValue("gray.500", "inherit"),
    ml: { base: "0", sm: "3" },
    onClick: toggleMode,
    icon: <SwitchIcon />,
  };

  const defaultMobileNavHamburgerStyles: IconButtonProps = {
    display: mobileNavigation ? { base: "flex", md: "none" } : "none",
    "aria-label": "Open menu",
    fontSize: "1.8em",
    color: useColorModeValue("gray.500", "inherit"),
    variant: "ghost",
    ml: { base: "0", sm: "3" },
    icon: <AiOutlineMenu />,
    onClick: mobileNavigation?.onOpen,
  };

  const CenterBaseHeader = () => (
    <chakra.header
      {...overrideStyles(
        defaultHeaderContainerStyles,
        styles?.headerContainerProps
      )}
    >
      <Flex
        {...overrideStyles(
          defaultFlexContainerStyles,
          styles?.flexContainerProps
        )}
      >
        <Flex
          {...overrideStyles(
            defaultLogoFlexContainerStyles,
            styles?.logoFlexContainerProps
          )}
        >
          <Link href="/" passHref>
            <HStack>
              <Box
                {...overrideStyles(
                  defaultLogoBoxContainerStyles,
                  styles?.logoBoxContainerProps
                )}
              >
                {logo}
              </Box>
            </HStack>
          </Link>
        </Flex>
        <Flex>
          <HStack
            {...overrideStyles(
              defaultLinksHstackContainerStyles,
              styles?.linksHstackContainerProps
            )}
          >
            {links.map((link) => link)}
          </HStack>
        </Flex>
        <Flex
          {...overrideStyles(
            defaultRightSectionFlexContainerStyles,
            styles?.rightSectionFlexContainerProps
          )}
        >
          <HStack
            {...overrideStyles(
              defaultRightSectionHstackContainerStyles,
              styles?.rightSectionHstackContainerProps
            )}
          >
            {signInOrAppLink}
            {loginButton}
          </HStack>
          <IconButton
            {...overrideStyles(
              defaultColorModeToggleStyles,
              styles?.colorModeToggleProps
            )}
          />
          <IconButton
            {...overrideStyles(
              defaultMobileNavHamburgerStyles,
              styles?.mobileNavHamburgerProps
            )}
          />
        </Flex>
      </Flex>
      {mobileNavigation ? mobileNavigation.menu : <></>}
    </chakra.header>
  );

  return CenterBaseHeader();
};
