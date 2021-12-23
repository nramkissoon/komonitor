import {
  Button,
  chakra,
  Flex,
  SimpleGrid,
  Spacer,
  useColorModeValue,
} from "@chakra-ui/react";
import NextLink from "next/link";
import { use24HourMonitorStatuses, useUptimeMonitors } from "../uptime/client";

const Link = (props: { href: string; children: React.ReactNode }) => (
  <NextLink href={props.href} passHref>
    <chakra.a
      color={useColorModeValue("blue.400", "blue.500")}
      _hover={{ cursor: "pointer", color: "gray.500" }}
    >
      {props.children}
    </chakra.a>
  </NextLink>
);

const UptimeMonitorPanel = () => {
  const { monitors, isLoading, isError } = useUptimeMonitors();
  const {
    statuses,
    isLoading: statusesIsLoading,
    isError: statusesIsError,
  } = use24HourMonitorStatuses(
    monitors ? monitors.map((monitor) => monitor.monitor_id) : []
  );

  const downMonitorsTotal =
    monitors && statuses
      ? (
          monitors.map((monitor) => {
            const mostRecentStatus = statuses[monitor.monitor_id].sort(
              (prev, next) => prev.timestamp - next.timestamp
            )[0];

            const isDown = mostRecentStatus
              ? mostRecentStatus.status === "down"
              : false;
            if (isDown) return 1;
            return 0;
          }) as number[]
        ).reduce((prev, next) => prev + next)
      : 0;

  console.log(downMonitorsTotal);

  const totalMonitors = monitors ? monitors.length : 0;

  return (
    <Flex
      bg={useColorModeValue("white", "#0f131a")}
      shadow="lg"
      borderRadius="md"
      py="2em"
      px="1.5em"
      flexDir="column"
    >
      <chakra.h2
        fontSize="xl"
        fontWeight="bold"
        textAlign={["center", "center", "left"]}
      >
        Uptime Monitors
      </chakra.h2>
      <chakra.h3 color="gray.600">
        Create, manage and inspect uptime monitors for your websites.
      </chakra.h3>
      <chakra.hr my="10px" />
      {monitors && !isLoading && totalMonitors === 0 ? (
        <Flex flexDir="row" justifyContent="space-between" alignItems="center">
          <chakra.h4 fontSize="lg">No monitors have been created.</chakra.h4>
          <NextLink href="app/uptime/new" passHref>
            <chakra.a
              fontWeight="medium"
              color={useColorModeValue("blue.400", "blue.500")}
              _hover={{ cursor: "pointer", color: "gray.500" }}
            >
              + Create a Monitor
            </chakra.a>
          </NextLink>
        </Flex>
      ) : (
        <Flex flexDir="row" justifyContent="space-between" alignItems="center">
          <chakra.h4 fontSize="lg">Total monitors: {totalMonitors}</chakra.h4>
          <NextLink href="app/uptime/new" passHref>
            <chakra.a
              fontWeight="medium"
              color={useColorModeValue("blue.400", "blue.500")}
              _hover={{ cursor: "pointer", color: "gray.500" }}
            >
              + Create a Monitor
            </chakra.a>
          </NextLink>
        </Flex>
      )}
      <Flex flexDir="row" justifyContent="space-between" alignItems="center">
        <chakra.h4 fontSize="lg">
          Total current down monitors: {downMonitorsTotal}
        </chakra.h4>
      </Flex>
      <Spacer />
      <NextLink passHref href={"/app/uptime"}>
        <Button
          float="left"
          size="lg"
          as="a"
          fontSize="xl"
          fontWeight="normal"
          px="1em"
          shadow="md"
          colorScheme="blue"
          bgColor="blue.400"
          color="white"
          _hover={{
            bg: "blue.600",
          }}
        >
          View Monitors
        </Button>
      </NextLink>
    </Flex>
  );
};

const Panel = (props: {
  type: string;
  description: string;
  href: string;
  buttonText: string;
}) => {
  const { type, description, href, buttonText } = props;
  return (
    <Flex
      bg={useColorModeValue("white", "#0f131a")}
      shadow="lg"
      borderRadius="xl"
      py="2em"
      px="1.5em"
      flexDir="column"
    >
      <chakra.h1 fontSize="4xl" fontWeight="normal" mb=".6em">
        {type}
      </chakra.h1>
      <chakra.h3
        mb="1em"
        fontSize="2xl"
        fontWeight="normal"
        textAlign={["center", "center", "left"]}
      >
        {description}
      </chakra.h3>
      <NextLink passHref href={href}>
        <Button
          float="left"
          size="lg"
          as="a"
          fontSize="xl"
          fontWeight="bold"
          px="1em"
          shadow="md"
          colorScheme="blue"
          bgColor="blue.400"
          color="white"
          _hover={{
            bg: "blue.600",
          }}
        >
          {buttonText}
        </Button>
      </NextLink>
    </Flex>
  );
};

export function AppIndexPage() {
  return (
    <Flex flexDir="column">
      <Flex
        mb="1em"
        justifyContent="space-between"
        flexDir={["column", "column", "row"]}
      >
        <chakra.h2 fontSize="xl" fontWeight="medium">
          At a glance:
        </chakra.h2>
        <chakra.h2 fontSize="xl" fontWeight="medium">
          New to Komonitor? Check out the{" "}
          <Link href="/docs/getting-started/introduction">
            docs to get started
          </Link>
          !
        </chakra.h2>
      </Flex>
      <SimpleGrid columns={[1, 1, 2]} spacingX={[6, 10]} spacingY={[10]}>
        <UptimeMonitorPanel />
        <Panel
          type={"🚨 Alerts"}
          description={
            "Create and manage alerts and attach them to your monitors."
          }
          href={"/app/alerts"}
          buttonText={"Go to Alerts"}
        />
        <Panel
          type={"⚙️ Account Settings"}
          description={
            "Manage your account settings, subscriptions, and integrations."
          }
          href={"/app/settings"}
          buttonText={"Go to Account"}
        />
      </SimpleGrid>
    </Flex>
  );
}
