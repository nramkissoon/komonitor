import {
  Box,
  Center,
  Divider,
  ScaleFade,
  Spinner,
  Stat,
  StatGroup,
  StatLabel,
  StatNumber,
  Text,
  useBreakpointValue,
  useColorModeValue,
} from "@chakra-ui/react";
import { AlertSeverities, AlertStates } from "project-types";
import React from "react";
import { timeAgo } from "../../../common/client-utils";
import { AlertSeverityCell } from "../../../common/components/Table-Cell";
import { AlertStateCell } from "./Table-Cell";

interface OverviewPageDataCardsProps {
  state: AlertStates | undefined;
  severity: AlertSeverities | undefined;
  mostRecentInvocationTimestamp: number | undefined;
}

interface StatWithLoadingProps {
  label: string;
  child: React.ReactNode;
}

function StatWithLoading(props: StatWithLoadingProps) {
  const { label, child } = props;
  return (
    <Stat>
      <StatLabel fontSize="md" textAlign="center">
        {label}
      </StatLabel>
      {child === undefined ? (
        <Center>
          <Spinner
            mt=".1em"
            size="md"
            thickness="2px"
            speed=".8s"
            emptyColor={useColorModeValue("gray.200", "gray.700")}
            color={useColorModeValue("blue.300", "blue.300")}
          />
        </Center>
      ) : (
        <StatNumber textAlign="center" mt=".1em">
          {child}
        </StatNumber>
      )}
    </Stat>
  );
}

export function OverviewPageDataCards(props: OverviewPageDataCardsProps) {
  const { state, severity, mostRecentInvocationTimestamp } = props;

  // divider orientation is not responsive so we will have to use this hack to hide/show the vertical when necessary
  const verticalDividerHidden = useBreakpointValue({ base: true, sm: false });
  const shouldFadeIn =
    state !== undefined ||
    mostRecentInvocationTimestamp !== undefined ||
    severity !== undefined;
  let noRecentInvocations = mostRecentInvocationTimestamp === -1;

  return (
    <ScaleFade in={shouldFadeIn} initialScale={0.8}>
      <Box
        bg={useColorModeValue("white", "#0f131a")}
        shadow="md"
        mb="2em"
        borderRadius="xl"
        py="1.5em"
      >
        <StatGroup
          h={[null, "4em"]}
          display="flex"
          flexDirection={["column", "row"]}
          alignItems={["center", "flex-start"]}
        >
          <StatWithLoading
            label="State"
            child={state ? AlertStateCell({ state }) : undefined}
          />
          <Divider
            orientation={"vertical"}
            borderColor="gray.500"
            hidden={verticalDividerHidden}
          />
          <Divider
            orientation={"horizontal"}
            borderColor="gray.300"
            hidden={!verticalDividerHidden}
            w="70%"
            my="1em"
          />
          <StatWithLoading
            label="Severity"
            child={severity ? AlertSeverityCell({ severity }) : undefined}
          />
          <Divider
            orientation={"vertical"}
            borderColor="gray.500"
            hidden={verticalDividerHidden}
          />
          <Divider
            orientation={"horizontal"}
            borderColor="gray.300"
            hidden={!verticalDividerHidden}
            w="70%"
            my="1em"
          />
          <StatWithLoading
            label="Last Invocation (24H)"
            child={
              mostRecentInvocationTimestamp ? (
                noRecentInvocations ? (
                  <Text fontWeight="normal">No Recent Invocations</Text>
                ) : (
                  <Text fontWeight="normal">
                    {timeAgo.format(mostRecentInvocationTimestamp)}
                  </Text>
                )
              ) : (
                // TODO WE NEED TO ADDRESS THE CASE WHERE ERRORS OCCUR IN FETCHING DATA
                <Text fontWeight="normal">No Recent Invocations</Text>
              )
            }
          />
        </StatGroup>
      </Box>
    </ScaleFade>
  );
}
