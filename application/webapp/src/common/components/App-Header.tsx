import {
  AddIcon,
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
  Spacer,
  useColorMode,
  useColorModeValue,
  useDisclosure,
} from "@chakra-ui/react";
import Fuse from "fuse.js";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";
import { HiMoon, HiSun } from "react-icons/hi";
import { useUptimeMonitorsForProject } from "../../modules/uptime/client";
import { useUser } from "../../modules/user/client";
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

const TeamSelector = ({
  isCurrent,
  team,
  setTeam,
}: {
  isCurrent: boolean;
  team: string;
  setTeam: (team: string) => void;
}) => {
  const router = useRouter();
  return (
    <Flex
      as="button"
      mx="2"
      px="4"
      my="1"
      py="1"
      rounded="lg"
      alignItems="center"
      justifyContent="space-between"
      bg={isCurrent ? useColorModeValue("blue.100", "gray.700") : "inherit"}
      _hover={{
        cursor: "pointer",
        bg: useColorModeValue("blue.200", "blue.700"),
      }}
      onClick={() => {
        setTeam(team);
        router.push(`/teams/${team}`);
      }}
    >
      <Box fontSize="lg">{team}</Box>

      {isCurrent ? (
        <Box>
          <CheckIcon boxSize="5" />
        </Box>
      ) : null}
    </Flex>
  );
};

const TeamSelection = () => {
  const { setTeam, team } = useTeam();
  const { user } = useUser();
  const router = useRouter();

  const teams = user && user.teams ? user.teams : [];

  const isPersonal = team === undefined;

  const [searchQuery, setSearchQuery] = React.useState("");
  const fuse = new Fuse(teams);
  const results = fuse.search(searchQuery);

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
        <PopoverBody px="2" py="0">
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
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </InputGroup>
            <Divider />

            <Flex
              as="button"
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
              _hover={{
                cursor: "pointer",
                bg: useColorModeValue("blue.200", "blue.700"),
              }}
              onClick={() => {
                setTeam(undefined);
                router.push(`/app`);
              }}
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
          <Flex my="2" py="1" flexDir="column">
            <Heading
              mx="2"
              as="h3"
              fontSize="sm"
              fontWeight="normal"
              letterSpacing="wider"
              color={useColorModeValue("gray.400", "gray.500")}
            >
              Teams
            </Heading>

            {searchQuery
              ? results.map((t) => (
                  <TeamSelector
                    key={t.item}
                    team={t.item}
                    setTeam={setTeam}
                    isCurrent={t.item === team}
                  />
                ))
              : teams.map((t) => (
                  <TeamSelector
                    key={t}
                    team={t}
                    setTeam={setTeam}
                    isCurrent={t === team}
                  />
                ))}
            <Link href="/teams/new" passHref>
              <Button
                as="a"
                mx="2"
                px="4"
                my="2"
                py="1"
                rounded="full"
                size="md"
                fontWeight="normal"
                leftIcon={<AddIcon />}
                bg="none"
                justifyContent="left"
                _hover={{ bg: useColorModeValue("blue.100", "gray.700") }}
              >
                Create Team
              </Button>
            </Link>
          </Flex>
        </PopoverBody>
      </PopoverContent>
    </Popover>
  );
};

export const AppHeader = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const { data: session, status } = useSession();
  const authed = session?.user !== undefined;

  const router = useRouter();
  const { projectId, monitorId } = router.query;
  const { team } = useTeam();

  const { monitors } = useUptimeMonitorsForProject(projectId as string);

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
            {monitorId && (
              <Box fontSize="lg">
                <chakra.span mx="15px" color="gray.500" fontWeight="bold">
                  /
                </chakra.span>
                <chakra.span fontWeight="normal" letterSpacing="wider">
                  {monitors
                    ? monitors[projectId as string].find(
                        (m) => m.monitor_id === monitorId
                      )?.name
                    : ""}
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
                  px="5px"
                  bg="none"
                  color={useColorModeValue("gray.900", "gray.400")}
                  _hover={{ color: useColorModeValue("gray.500", "white") }}
                  display="flex"
                  w="fit-content"
                  alignItems="center"
                  fontWeight="medium"
                >
                  <ArrowBackIcon /> Return to project page
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
