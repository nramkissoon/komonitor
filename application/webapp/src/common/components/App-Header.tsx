import {
  ArrowBackIcon,
  CheckIcon,
  SearchIcon,
  TriangleDownIcon,
} from "@chakra-ui/icons";
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
            <Link href="/app" passHref>
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
                _hover={{ cursor: "pointer" }}
              >
                <Box fontSize="lg">Personal Account</Box>

                {isPersonal ? (
                  <Box>
                    <CheckIcon boxSize="5" />
                  </Box>
                ) : null}
              </Flex>
            </Link>
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

  const router = useRouter();
  const { projectId } = router.query;
  const { team } = useTeam();

  const defaultHeaderContainerStyles: HTMLChakraProps<"header"> = {
    h: "full",
    maxW: ["sm", "xl", "3xl", "5xl", "6xl"],
    m: "auto",
    py: 4,
  };

  const defaultFlexContainerStyles: FlexProps = {
    h: "full",
    w: "full",
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

  return (
    <Box
      bg={useColorModeValue("white", "gray.900")}
      borderBottom={useColorModeValue("gray.100", "gray.800")}
      shadow="sm"
    >
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
          <Flex ml="2em" alignItems="center">
            <TeamSelection />
            {projectId && (
              <Box fontSize="lg">
                <chakra.span mx="15px" color="gray.500" fontWeight="bold">
                  /
                </chakra.span>
                <chakra.span fontWeight="normal" letterSpacing="wider">
                  {projectId}
                </chakra.span>
              </Box>
            )}
          </Flex>
          <Spacer />
          <Flex justify="flex-end" align="center" color="gray.400">
            {projectId && (
              <Link href={team ? "/" + team : "/app"} passHref>
                <Button
                  p="0"
                  bg="none"
                  color={useColorModeValue("gray.900", "gray.400")}
                  _hover={{ color: useColorModeValue("gray.500", "white") }}
                  display="flex"
                  w="fit-content"
                  alignItems="center"
                  fontWeight="medium"
                >
                  <ArrowBackIcon /> Return to projects
                </Button>
              </Link>
            )}
            {HeaderLink({
              text: "Docs",
              href: "/docs/getting-started/introduction",
            })}
            <IconButton {...defaultColorModeToggleStyles} />
          </Flex>
        </Flex>
      </chakra.header>
    </Box>
  );
};
