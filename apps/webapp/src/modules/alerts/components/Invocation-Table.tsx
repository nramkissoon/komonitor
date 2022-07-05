import {
  Badge,
  Box,
  chakra,
  Flex,
  Grid,
  GridItem,
  Heading,
  useColorModeValue,
} from "@chakra-ui/react";
import React from "react";
import { Column } from "react-table";
import { Alert, AlertInvocation, toExternalAlertInvocation } from "utils";
import { JSONDownloadButton } from "../../../common/components/JSON-Download-Button";
import {
  JSONCopyButton,
  JsonViewer,
} from "../../../common/components/Json-Viewer";
import { CommonOverviewTable } from "../../../common/components/Overview-Table";
import { SimpleTimestampCell } from "../../../common/components/Table-Cell";
import { useUserTimezoneAndOffset } from "../../user/client";

interface RowProps {
  monitor: {
    id: string;
    name: string;
  };
  timestampAndOngoing: {
    timestamp: number;
    ongoing: boolean;
  };
  alert: Alert;
  obj: AlertInvocation;
  type?: string;
  filterString: string;
}

function rowPropsGeneratorFunction(invocations: AlertInvocation[]): RowProps[] {
  return invocations
    ? invocations.map((invocation) => {
        const { monitor_id, name, url } = invocation.monitor;
        return {
          timestampAndOngoing: {
            timestamp: invocation.timestamp,
            ongoing: invocation.ongoing,
          },
          monitor: {
            id: monitor_id,
            name: name,
          },
          alert: invocation.alert,
          obj: invocation,
          type: invocation.type,
          filterString: [
            name,
            new Date(invocation.timestamp).toUTCString(),
          ].join(" "),
        };
      })
    : [];
}

interface InvocationTableProps {
  invocations: AlertInvocation[] | undefined;
}

function AlertTypeCell(props: { type: string }) {
  let color = "gray";
  if (props.type === "incident_start") color = "green";
  if (props.type === "incident_end") color = "red";
  return (
    <Badge
      variant="subtle"
      colorScheme={color}
      fontSize="sm"
      fontWeight="normal"
      py=".3em"
      px=".5em"
      borderRadius="md"
    >
      {props.type ?? "unknown"}
    </Badge>
  );
}

export function InvocationTable(props: InvocationTableProps) {
  const { invocations } = props;

  const [invocationToView, setInvocationToView] = React.useState<
    object | undefined
  >(undefined);

  const {
    data: tzAndOffset,
    isLoading: tzPrefIsLoading,
    isError: tzPrefIsError,
  } = useUserTimezoneAndOffset();

  const columns: Column[] = [
    { id: "filter-column", filter: "includes", accessor: "filterString" },

    {
      Header: "Alert Type",
      accessor: "type",
      disableSortBy: true,
      Cell: (props) => AlertTypeCell({ type: props.value }),
    },
    {
      Header: "Timestamp",
      accessor: "timestampAndOngoing",
      Cell: (props) =>
        SimpleTimestampCell({
          timestampAndOngoing: props.cell.value,
          offset: tzAndOffset?.offset ?? 0,
        }),
    },
    {
      id: "obj",
      accessor: "obj",
      Cell: (props) => {
        "hidden";
      },
    },
  ];

  const JsonViewerBg = useColorModeValue("white", "gray.950");
  const JsonViewerScrollBarColor = useColorModeValue("#E2E8F0", "#1A202C");

  return (
    <>
      <Heading textAlign="left" size="lg" mb=".7em" as="h2" fontWeight="medium">
        Alerts{" "}
        <chakra.span fontSize="lg" color="gray.500">
          (all time)
        </chakra.span>
      </Heading>
      <Grid templateColumns={"repeat(2, 1fr)"} gap={4}>
        <GridItem colSpan={1} w="100%" borderRadius="lg">
          {CommonOverviewTable<RowProps>({
            data: {
              dependencies: [invocations ? invocations : []],
              dependenciesIsLoading: invocations === undefined,
              rowPropsGeneratorFunction: rowPropsGeneratorFunction,
            },
            columns: columns,
            itemType: "Alert Invocations",
            jsonDownLoad: (
              <JSONDownloadButton
                data={invocations?.map((i) => toExternalAlertInvocation(i))}
                filename={"alerts.json"}
              />
            ),
            jsonViewProps: {
              objToView: invocationToView,
              onClick: (obj: any) =>
                setInvocationToView(toExternalAlertInvocation(obj) as object),
              checkFunc: (obj) => {
                if (!obj) return null;
                return obj.timestamp;
              },
            },
          })}
        </GridItem>
        <GridItem colSpan={1}>
          {invocationToView && (
            <>
              <Flex h="50px" flexDir="row" w="2xl" float="right">
                <JSONCopyButton data={invocationToView} />
              </Flex>
              <Box
                w="2xl"
                overflowX="scroll"
                h={"2xl"}
                float="right"
                py="20px"
                rounded="sm"
                bg={JsonViewerBg}
                css={{
                  "&::-webkit-scrollbar": {
                    width: "10px",
                    height: "10px",
                  },
                  "&::-webkit-scrollbar-track": {
                    width: "10px",
                    height: "10px",
                  },
                  "&::-webkit-scrollbar-thumb": {
                    background: JsonViewerScrollBarColor,
                  },
                  "&::-webkit-scrollbar-corner": {
                    background: "rgba(0,0,0,0)",
                  },
                }}
              >
                <JsonViewer
                  json={JSON.stringify(
                    toExternalAlertInvocation(invocationToView as any),
                    null,
                    2
                  )}
                />
              </Box>
            </>
          )}
          {!invocationToView && (
            <Flex alignItems={"center"} justifyContent="center" h="full">
              <Box fontSize="lg">Select an alert in the table to view.</Box>
            </Flex>
          )}
        </GridItem>
      </Grid>
    </>
  );
}
