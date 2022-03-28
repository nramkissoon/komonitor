import {
  Box,
  Button,
  ButtonProps,
  Center,
  chakra,
  CloseButton,
  CloseButtonProps,
  Flex,
  FlexProps,
  HStack,
  HTMLChakraProps,
  IconButton,
  IconButtonProps,
  Slide,
  SlideProps,
  Spacer,
  StackProps,
  useColorMode,
  useColorModeValue,
  useDisclosure,
  VStack,
} from "@chakra-ui/react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import React from "react";
import { AiOutlineMenu } from "react-icons/ai";
import { HiMoon, HiSun } from "react-icons/hi";
import { HeaderLogo } from "./Header-Logo";

const HeaderLink = (props: {
  text: string;
  href: string;
  useColorModeValue: Function;
  buttonProps?: ButtonProps;
}) => {
  const { text, href, buttonProps, useColorModeValue } = props;

  const defaultButtonLinkStyles: ButtonProps = {
    color: useColorModeValue("gray.900", "gray.400"),
    display: "inline-flex",
    alignItems: "center",
    variant: "ghost",
    fontWeight: "medium",
    fontSize: "lg",
    _focus: { boxShadow: "none" },
    _hover: { color: useColorModeValue("gray.500", "white") },
    as: "a",
  };

  return (
    <Link href={href} passHref>
      <Button {...defaultButtonLinkStyles} {...buttonProps}>
        {text}
      </Button>
    </Link>
  );
};

const GoToAppOrSigninButton = (props: {
  authed: boolean;
  useColorModeValue: Function;
}) => {
  const { authed, useColorModeValue } = props;
  return (
    <Link href={authed ? "/app" : "/auth/signin"} passHref>
      <Button
        as="a"
        size="md"
        colorScheme="blue"
        bgColor="blue.300"
        fontSize="lg"
        fontWeight="medium"
        color="white"
        _hover={{
          bg: "blue.600",
        }}
      >
        {authed ? "Dashboard" : "Get Started"}
      </Button>
    </Link>
  );
};

const MobileNavHeader = (props: {
  isOpen: boolean;
  onClose: React.MouseEventHandler<HTMLButtonElement>;
  useColorModeValue: Function;
}) => {
  const { isOpen, onClose, useColorModeValue } = props;

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
    bg: useColorModeValue("white", "gray.900"),
    rounded: "md",
    shadow: "sm",
    spacing: 4,
  };

  const defaultCloseButtonStyles: CloseButtonProps = {
    "aria-label": "Close menu",
    justifySelf: "self-start",
    onClick: onClose,
    bg: useColorModeValue("white", "gray.900"),
  };

  const linkButtonStyles: ButtonProps = {
    w: "80%",
    h: "3em",
    fontSize: "xl",
    bg: useColorModeValue("blue.100", "gray.700"),
    color: useColorModeValue("gray.900", "white"),
    _hover: {
      bg: useColorModeValue("blue.300", "gray.400"),
      color: useColorModeValue("gray.100", "white"),
    },
  };

  return (
    <Slide {...defaultSlideTransitionStyles}>
      <VStack {...defaultVstackContainerStyles}>
        <CloseButton {...defaultCloseButtonStyles} />
        {HeaderLink({
          text: "Pricing",
          href: "/pricing",
          buttonProps: linkButtonStyles,
          useColorModeValue,
        })}
      </VStack>
    </Slide>
  );
};

export const Header = ({ lightModeOnly }: { lightModeOnly?: boolean }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const { data: session } = useSession();
  const authed = session?.user !== undefined;

  const { setColorMode, toggleColorMode: toggleMode } = useColorMode();
  const colorModeText = useColorModeValue("dark", "light");
  let darkIcon = HiMoon;
  let lightIcon = HiSun;

  let SwitchIcon = useColorModeValue(darkIcon, lightIcon);

  let useColorModeValueModified = (light: string, dark: string) => {
    if (lightModeOnly === true) return useColorModeValue(light, light);
    return useColorModeValue(light, dark);
  };

  const defaultHeaderContainerStyles: HTMLChakraProps<"header"> = {
    h: "full",
    w: "full",
    maxW: "8xl",
    px: [8, null, null, null, null, 0],
    py: 4,
  };

  const defaultFlexContainerStyles: FlexProps = {
    h: "full",
    w: "full",
    alignItems: "center",
  };

  const defaultColorModeToggleStyles: IconButtonProps = {
    size: "md",
    fontSize: "1.8em",
    "aria-label": `Switch to ${colorModeText} mode`,
    variant: "ghost",
    color: useColorModeValueModified("gray.500", "inherit"),
    ml: { base: "0", sm: "3" },
    onClick: toggleMode,
    icon: <SwitchIcon />,
  };

  const defaultMobileNavHamburgerStyles: IconButtonProps = {
    display: { base: "flex", md: "flex", lg: "none" },
    "aria-label": "Open menu",
    fontSize: "1.8em",
    color: useColorModeValueModified("gray.500", "inherit"),
    variant: "ghost",
    ml: { base: "0", sm: "3" },
    icon: <AiOutlineMenu />,
    onClick: onOpen,
  };

  const defaultLinksHstackContainerStyles: StackProps = {
    spacing: "9",
    display: { base: "none", md: "none", lg: "flex" },
    fontSize: "lg",
  };

  return (
    <Center
      {...{
        h: "full",
        w: "full",
        bg: useColorModeValueModified("white", "gray.900"),
        borderBottomColor: useColorModeValueModified("gray.100", "gray.800"),
        borderBottomWidth: useColorModeValueModified("0px", "1px"),
        shadow: "sm",
      }}
    >
      <chakra.header {...defaultHeaderContainerStyles}>
        <Flex {...defaultFlexContainerStyles}>
          <Flex align="flex-start">
            <Link href="/" passHref>
              <HStack>
                <Box w="fit-content">
                  <HeaderLogo useLightModeValue={lightModeOnly} />
                </Box>
              </HStack>
            </Link>
          </Flex>
          <Spacer />
          <Flex mr="3em">
            <HStack {...defaultLinksHstackContainerStyles}>
              {HeaderLink({
                text: "Pricing",
                href: "/pricing",
                useColorModeValue: useColorModeValueModified,
              })}
            </HStack>
          </Flex>
          <Flex justify="flex-end" align="center" color="gray.400">
            <HStack
              justify="flex-end"
              align="center"
              color="gray.400"
              mr=".8em"
            >
              {GoToAppOrSigninButton({
                authed: authed,
                useColorModeValue: useColorModeValueModified,
              })}
            </HStack>
            {<IconButton {...defaultColorModeToggleStyles} />}
            <IconButton {...defaultMobileNavHamburgerStyles} />
          </Flex>
        </Flex>
        {MobileNavHeader({
          isOpen: isOpen,
          onClose: onClose,
          useColorModeValue: useColorModeValueModified,
        })}
      </chakra.header>
    </Center>
  );
};
