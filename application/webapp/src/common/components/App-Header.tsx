import { CheckIcon, SearchIcon, TriangleDownIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  ButtonProps,
  chakra,
  CloseButton,
  CloseButtonProps,
  Divider,
  Flex,
  FlexProps,
  Heading,
  HStack,
  HTMLChakraProps,
  IconButton,
  IconButtonProps,
  Input,
  InputGroup,
  InputLeftElement,
  Popover,
  PopoverBody,
  PopoverContent,
  PopoverTrigger,
  Slide,
  SlideProps,
  Spacer,
  StackProps,
  useColorMode,
  useColorModeValue,
  useDisclosure,
  VStack,
} from "@chakra-ui/react";
import { useSession } from "next-auth/client";
import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";
import { AiOutlineMenu } from "react-icons/ai";
import { HiMoon, HiSun } from "react-icons/hi";
import { HeaderLogo } from "./Header-Logo";
import { useTeam } from "./TeamProvider";

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
        {/* {HeaderLink({
          text: "Lighthouse",
          href: "/app/lighthouse",
          buttonProps: linkButtonStyles,
        })} */}
        {HeaderLink({
          text: "Docs",
          href: "/docs",
          buttonProps: linkButtonStyles,
        })}
      </VStack>
    </Slide>
  );
};

const TeamSelection = () => {
  const { setTeam, team } = useTeam();

  const isPersonal = team === undefined;

  return (
    <Popover placement="bottom-start">
      <PopoverTrigger>
        <Button
          rightIcon={<TriangleDownIcon />}
          variant="outline"
          bg={useColorModeValue("white", "gray.950")}
          borderColor={useColorModeValue("black", "gray.600")}
          px="5"
          fontWeight="normal"
          letterSpacing="wider"
        >
          {isPersonal ? "Personal Account" : team}
        </Button>
      </PopoverTrigger>
      <PopoverContent backgroundColor={useColorModeValue("white", "gray.950")}>
        <PopoverBody p="0">
          <Flex flexDir="column">
            <InputGroup mr="1em">
              <InputLeftElement
                pointerEvents="none"
                children={<SearchIcon color="gray.300" />}
              />
              <Input
                rounded="sm"
                border="none"
                size="md"
                placeholder="Search..."
                background={useColorModeValue("white", "gray.950")}
              />
            </InputGroup>
            <Divider />
            <Flex
              mx="2"
              px="4"
              my="2"
              py="1"
              rounded="lg"
              alignItems="center"
              justifyContent="space-between"
              bg={
                isPersonal
                  ? useColorModeValue("blue.100", "gray.700")
                  : "inherit"
              }
            >
              <Box fontSize="lg">Personal Account</Box>
              {isPersonal ? (
                <Box>
                  <CheckIcon boxSize="5" />
                </Box>
              ) : null}
            </Flex>
          </Flex>
          <Divider />
          <Flex mx="2" px="4" my="2" py="1" flexDir="column">
            <Heading
              as="h3"
              fontSize="sm"
              fontWeight="normal"
              letterSpacing="wider"
              color={useColorModeValue("gray.400", "gray.500")}
            >
              Teams
            </Heading>
            <Box fontSize="lg">Coming soon</Box>
          </Flex>
        </PopoverBody>
      </PopoverContent>
    </Popover>
  );
};

export const AppHeader = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const [session, loading] = useSession();
  const authed = session?.user !== undefined;

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

  const { toggleColorMode: toggleMode } = useColorMode();
  const colorModeText = useColorModeValue("dark", "light");
  let darkIcon = HiMoon;
  let lightIcon = HiSun;
  let SwitchIcon = useColorModeValue(darkIcon, lightIcon);

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

  return (
    <chakra.header {...defaultHeaderContainerStyles}>
      <Flex {...defaultFlexContainerStyles}>
        <Flex align="flex-start">
          <Link href="/" passHref>
            <HStack>
              <Box w="fit-content">
                <HeaderLogo />
              </Box>
            </HStack>
          </Link>
        </Flex>
        <Flex ml="2em">
          <TeamSelection />
        </Flex>
        <Spacer />
        <Flex justify="flex-end" align="center" color="gray.400">
          {HeaderLink({
            text: "Docs",
            href: "/docs/getting-started/introduction",
          })}
          <IconButton {...defaultColorModeToggleStyles} />
          <IconButton {...defaultMobileNavHamburgerStyles} />
        </Flex>
      </Flex>
      {MobileNavHeader({ isOpen: isOpen, onClose: onClose })}
    </chakra.header>
  );
};
