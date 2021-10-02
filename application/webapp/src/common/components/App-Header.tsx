import {
  Box,
  Button,
  ButtonProps,
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
import { signOut, useSession } from "next-auth/client";
import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";
import { AiOutlineMenu } from "react-icons/ai";
import { HiMoon, HiSun } from "react-icons/hi";

const HeaderLink = (props: {
  text: string;
  href: string;
  buttonProps?: ButtonProps;
}) => {
  const { text, href, buttonProps } = props;
  const router = useRouter();

  const selected = router.asPath.startsWith(href);

  const defaultButtonLinkStyles: ButtonProps = {
    color: !selected ? useColorModeValue("gray.900", "gray.400") : "blue.400",
    display: "inline-flex",
    alignItems: "center",
    variant: "ghost",
    fontWeight: "medium",
    fontSize: "medium",
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

const SignOutButton = (props: { authed: boolean }) => {
  const { authed } = props;
  return authed ? (
    <Button
      color={useColorModeValue("gray.900", "red.400")}
      size="md"
      variant="ghost"
      fontSize="md"
      fontWeight="medium"
      as="a"
      onClick={() => signOut({ callbackUrl: "/" })}
      _focus={{ boxShadow: "none" }}
      _hover={{
        color: useColorModeValue("gray.500", "red.200"),
        cursor: "pointer",
      }}
    >
      Sign out
    </Button>
  ) : (
    <></>
  );
};

const MobileNavHeader = (props: {
  isOpen: boolean;
  onClose: React.MouseEventHandler<HTMLButtonElement>;
}) => {
  const { isOpen, onClose } = props;

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
          text: "Uptime",
          href: "/app/uptime",
          buttonProps: linkButtonStyles,
        })}
        {HeaderLink({
          text: "Browser",
          href: "/app/browser",
          buttonProps: linkButtonStyles,
        })}
        {HeaderLink({
          text: "Lighthouse",
          href: "/app/lighthouse",
          buttonProps: linkButtonStyles,
        })}
        {HeaderLink({
          text: "Alerts",
          href: "/app/alerts",
          buttonProps: linkButtonStyles,
        })}
        {HeaderLink({
          text: "Settings",
          href: "/settings",
          buttonProps: linkButtonStyles,
        })}
      </VStack>
    </Slide>
  );
};

export const AppHeader = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const [session, loading] = useSession();
  const authed = session?.user !== undefined;

  const { toggleColorMode: toggleMode } = useColorMode();
  const colorModeText = useColorModeValue("dark", "light");
  let darkIcon = HiMoon;
  let lightIcon = HiSun;

  let SwitchIcon = useColorModeValue(darkIcon, lightIcon);

  const defaultHeaderContainerStyles: HTMLChakraProps<"header"> = {
    h: "full",
    w: "full",
    px: { base: 2, sm: 4, md: "6em", xl: "12em" },
    py: 4,
    bg: useColorModeValue("white", "gray.900"),
    borderBottomColor: useColorModeValue("gray.100", "gray.800"),
    borderBottomWidth: useColorModeValue("0px", "1px"),
    shadow: "sm",
  };

  const defaultFlexContainerStyles: FlexProps = {
    h: "full",
    w: "full",
    px: "6",
    alignItems: "center",
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
    display: { base: "flex", md: "flex", lg: "none" },
    "aria-label": "Open menu",
    fontSize: "1.8em",
    color: useColorModeValue("gray.500", "inherit"),
    variant: "ghost",
    ml: { base: "0", sm: "3" },
    icon: <AiOutlineMenu />,
    onClick: onOpen,
  };

  const defaultLinksHstackContainerStyles: StackProps = {
    spacing: "6",
    display: { base: "none", md: "none", lg: "flex" },
    fontSize: "lg",
  };

  return (
    <chakra.header {...defaultHeaderContainerStyles}>
      <Flex {...defaultFlexContainerStyles}>
        <Flex align="flex-start">
          <Link href="/" passHref>
            <HStack>
              <Box w="5em">Company</Box>
            </HStack>
          </Link>
        </Flex>
        <Flex ml="2em">
          <HStack {...defaultLinksHstackContainerStyles}>
            {HeaderLink({
              text: "Uptime",
              href: "/app/uptime",
            })}
            {HeaderLink({
              text: "Browser",
              href: "/app/browser",
            })}
            {HeaderLink({
              text: "Lighthouse",
              href: "/app/lighthouse",
            })}
            {HeaderLink({
              text: "Alerts",
              href: "/app/alerts",
            })}
            {HeaderLink({
              text: "Settings",
              href: "/settings",
            })}
          </HStack>
        </Flex>
        <Spacer />
        <Flex justify="flex-end" align="center" color="gray.400">
          <HStack justify="flex-end" align="center" color="gray.400">
            {SignOutButton({ authed: authed })}
          </HStack>
          <IconButton {...defaultColorModeToggleStyles} />
          <IconButton {...defaultMobileNavHamburgerStyles} />
        </Flex>
      </Flex>
      {MobileNavHeader({ isOpen: isOpen, onClose: onClose })}
    </chakra.header>
  );
};
