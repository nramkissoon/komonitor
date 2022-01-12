import { Box, Flex } from "@chakra-ui/react";
import { Alert, AlertInvocation } from "project-types";
import { Column } from "react-table";
import { JSONDownloadButton } from "../../../common/components/JSON-Download-Button";
import { CommonOverviewTable } from "../../../common/components/Overview-Table";
import { SimpleTimestampCell } from "../../../common/components/Table-Cell";
import { useUserTimezoneAndOffset } from "../../user/client";
import { alertTypeToBadge } from "./Alert-Type-Badges";

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
          filterString: [
            name,
            new Date(invocation.timestamp).toUTCString(),
          ].join(" "),
        };
      })
    : [];
}

const AlertChannelCell = (alert: Alert) => (
  <Flex>
    {alert.channels.map((channel) => (
      <Box key={channel} mr="1em">
        {alertTypeToBadge(channel)}
      </Box>
    ))}
  </Flex>
);

interface InvocationTableProps {
  invocations: AlertInvocation[] | undefined;
}

export function InvocationTable(props: InvocationTableProps) {
  const { invocations } = props;

  const {
    data: tzAndOffset,
    isLoading: tzPrefIsLoading,
    isError: tzPrefIsError,
  } = useUserTimezoneAndOffset();

  const columns: Column[] = [
    { id: "filter-column", filter: "includes", accessor: "filterString" },
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
      Header: "Alert Channels",
      accessor: "alert",
      disableSortBy: true,
      Cell: (props) => AlertChannelCell(props.cell.value as Alert),
    },
  ];

  return (
    <>
      {CommonOverviewTable<RowProps>({
        data: {
          dependencies: [
            invocations
              ? invocations.sort((a, b) => b.timestamp - a.timestamp)
              : [],
          ],
          dependenciesIsLoading: invocations === undefined,
          rowPropsGeneratorFunction: rowPropsGeneratorFunction,
        },
        columns: columns,
        itemType: "Alert Invocations",
        jsonDownLoad: (
          <JSONDownloadButton data={invocations} filename={"alerts.json"} />
        ),
      })}
    </>
  );
}
