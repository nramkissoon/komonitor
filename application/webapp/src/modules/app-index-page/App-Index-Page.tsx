import { ArrowForwardIcon } from "@chakra-ui/icons";
import {
  Button,
  chakra,
  Flex,
  SimpleGrid,
  Spacer,
  useColorModeValue,
} from "@chakra-ui/react";
import NextLink from "next/link";
import { PLAN_PRODUCT_IDS } from "../billing/plans";
import { createAndRedirectToCustomerPortal } from "../settings/client";
import { use24HourMonitorStatuses, useUptimeMonitors } from "../uptime/client";
import { useUserServicePlanProductId } from "../user/client";

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
              (prev, next) => next.timestamp - prev.timestamp
            )[0];

            const isDown = mostRecentStatus
              ? mostRecentStatus.status === "down"
              : false;
            if (isDown) return 1;
            return 0;
          }) as number[]
        ).reduce((prev, next) => prev + next)
      : 0;

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
        fontSize="2xl"
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
          mt="1.5em"
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
          rightIcon={<ArrowForwardIcon />}
        >
          Go to Monitors
        </Button>
      </NextLink>
    </Flex>
  );
};

const SettingsPanel = () => {
  const { data, isLoading, isError } = useUserServicePlanProductId();
  let productId = data ? data.productId : PLAN_PRODUCT_IDS.FREE;
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
        fontSize="2xl"
        fontWeight="bold"
        textAlign={["center", "center", "left"]}
      >
        Account
      </chakra.h2>
      <chakra.h3 color="gray.600">
        Manage your account settings, subscriptions, and integrations.
      </chakra.h3>
      <chakra.hr my="10px" />
      {productId === PLAN_PRODUCT_IDS.FREE ? (
        <Flex flexDir="row" justifyContent="space-between" alignItems="center">
          <chakra.h4 fontSize="lg">Your account is on free tier.</chakra.h4>
          <NextLink href="pricing" passHref>
            <chakra.a
              fontWeight="medium"
              color={useColorModeValue("blue.400", "blue.500")}
              _hover={{ cursor: "pointer", color: "gray.500" }}
            >
              Upgrade Account
            </chakra.a>
          </NextLink>
        </Flex>
      ) : (
        <Flex flexDir="row" justifyContent="space-between" alignItems="center">
          <chakra.h4 fontSize="lg">
            Your account is on a paid subscription.
          </chakra.h4>
          <Button
            variant="unstyled"
            onClick={() => createAndRedirectToCustomerPortal()}
            fontWeight="medium"
            color={useColorModeValue("blue.400", "blue.500")}
            _hover={{ cursor: "pointer", color: "gray.500" }}
          >
            Manage Subscription
          </Button>
        </Flex>
      )}
      <Spacer />
      <NextLink passHref href={"/app/settings"}>
        <Button
          mt="1.5em"
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
          rightIcon={<ArrowForwardIcon />}
        >
          Go to Account Settings
        </Button>
      </NextLink>
    </Flex>
  );
};

export function AppIndexPage() {
  return (
    <Flex flexDir="column">
      <Flex
        mb="2rem"
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
        <SettingsPanel />
      </SimpleGrid>
    </Flex>
  );
}
