import { SearchIcon } from "@chakra-ui/icons";
import {
  Box,
  Input,
  InputGroup,
  InputGroupProps,
  InputLeftElement,
  InputProps,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  useColorModeValue,
} from "@chakra-ui/react";
import React from "react";
import {
  Column,
  useAsyncDebounce,
  useGlobalFilter,
  usePagination,
  useTable,
} from "react-table";
import { useSWRConfig } from "swr";
import {
  UptimeMonitor,
  UptimeMonitorStatus,
  UptimeMonitorWithStatuses,
} from "types";
import { percentile } from "../../../common/utils";
import { MonitorDeleteDialog } from "./Delete-Monitor-Dialog";
import { ActionsCell, DescriptionCell } from "./Overview-Table-Cell";

interface TableProps {
  statusesMap: { [monitorId: string]: UptimeMonitorStatus[] };
  monitors: UptimeMonitor[];
}

export interface RowProps {
  description: {
    monitorId: string;
    name: string;
    url: string;
  };
  lastChecked: string;
  status: string;
  uptime: string;
  p90Latency: string;
  actions: {
    monitorId: string;
    name: string;
  };
  filterString: string;
}

export function calculateUptimeString(
  statuses: UptimeMonitorStatus[] | undefined
) {
  if (!statuses || statuses.length === 0) return "N/A";

  const up = statuses.filter((status) => status.status === "up").length;
  return ((up / statuses.length) * 100).toFixed(2).toString();
}

export function calculateP90LatencyString(
  statuses: UptimeMonitorStatus[] | undefined
) {
  if (!statuses || statuses.length === 0) return "N/A";

  const latencies = statuses.map((status) => status.latency);
  const p90 = percentile(latencies, 90);
  return p90?.toPrecision(4).toString() + "ms";
}

function createRowPropsFromMonitorData(
  data: UptimeMonitorWithStatuses
): RowProps {
  const mostRecentStatus =
    data.statuses && data.statuses.length > 0
      ? data.statuses?.reduce((prev, current) => {
          return prev.timestamp > current.timestamp ? prev : current;
        })
      : null;
  return {
    description: {
      monitorId: data.monitor_id,
      name: data.name,
      url: data.url,
    },
    lastChecked: mostRecentStatus
      ? mostRecentStatus.timestamp.toString()
      : "N/A",
    status: mostRecentStatus ? mostRecentStatus.status : "N/A",
    uptime: calculateUptimeString(data.statuses),
    p90Latency: calculateP90LatencyString(data.statuses),
    actions: {
      monitorId: data.monitor_id,
      name: data.name,
    },
    filterString: [
      data.name,
      data.url,
      mostRecentStatus ? mostRecentStatus : "",
      data.region,
    ].join(" "),
  };
}

function GlobalFilter(props: {
  globalFilter: any;
  setGlobalFilter: (filterValue: any) => void;
}) {
  const [value, setValue] = React.useState(props.globalFilter);
  const onChange = useAsyncDebounce((value) => {
    props.setGlobalFilter(value || undefined);
  }, 200);

  const spacing: InputGroupProps = {
    w: ["100%", "60%", "50%", "40%", "30%"],
    mb: "1em",
  };

  const styles: InputProps = {
    shadow: "sm",
    borderColor: "gray.400",
    borderWidth: "1px",
  };

  return (
    <InputGroup {...spacing}>
      <InputLeftElement children={<SearchIcon color="gray.500" />} />
      <Input
        type="text"
        value={value || ""}
        onChange={(e) => {
          setValue(e.target.value);
          onChange(e.target.value);
        }}
        placeholder="Search Monitors..."
        {...styles}
      />
    </InputGroup>
  );
}

function createMonitorDataWithStatus(
  statusesMap: { [monitorId: string]: UptimeMonitorStatus[] },
  monitors: UptimeMonitor[]
) {
  const data: UptimeMonitorWithStatuses[] = [];
  for (let monitor of monitors) {
    const newData: UptimeMonitorWithStatuses = {
      statuses: statusesMap[monitor.monitor_id] ?? [],
      ...monitor,
    };
    data.push(newData);
  }
  return data;
}

export function OverviewTable(props: TableProps) {
  // Setup for delete dialog
  const { mutate } = useSWRConfig();
  const [deleteMonitor, setDeleteMonitor] = React.useState({} as any);
  const onCloseDeleteDialog = () => setDeleteMonitor({});
  const cancelRef = React.useRef();
  const openDeleteDialog = (name: string, id: string) =>
    setDeleteMonitor({ name: name, monitorId: id });

  // Setup for table
  const data = React.useMemo(() => {
    return createMonitorDataWithStatus(props.statusesMap, props.monitors).map(
      (monitor) => createRowPropsFromMonitorData(monitor)
    );
  }, [props.monitors, props.statusesMap]);
  const tableColumns = React.useMemo(
    (): Column[] => [
      {
        Header: "Monitor",
        accessor: "description",
        Cell: (props) => DescriptionCell(props.cell.value),
      },
      {
        Header: "Status",
        accessor: "status",
        filter: "includes",
      },
      {
        Header: "Uptime",
        accessor: "uptime",
      },
      {
        Header: "p90 Latency",
        accessor: "p90Latency",
      },
      {
        Header: "Last checked",
        accessor: "lastChecked",
      },
      {
        Header: "Actions",
        accessor: "actions",
        Cell: (props) =>
          ActionsCell({
            cellValues: props.cell.value,
            openDeleteDialog: openDeleteDialog,
          }),
      },
      {
        id: "filter-column",
        filter: "includes",
        accessor: "filterString",
      },
    ],
    []
  );

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    page,
    canPreviousPage,
    canNextPage,
    pageOptions,
    pageCount,
    gotoPage,
    nextPage,
    previousPage,
    setPageSize,
    setGlobalFilter,
    preGlobalFilteredRows,
    state: { pageIndex, pageSize, globalFilter },
  } = useTable(
    {
      columns: tableColumns,
      data: data,
      autoResetSortBy: false,
      autoResetPage: false,
      initialState: { pageIndex: 0, pageSize: 10 },
    },
    useGlobalFilter,
    usePagination
  );

  // this is defined here to avoid adding more hook calls as rows are added
  const tableBorderColor = useColorModeValue("gray.300", "gray.700");

  return (
    <Box
      w="100%"
      shadow="lg"
      bg={useColorModeValue("gray.50", "#0f131a")}
      borderRadius="xl"
      p="1.5em"
      mb="2em"
    >
      {MonitorDeleteDialog({
        isOpen: deleteMonitor.monitorId !== undefined,
        name: deleteMonitor.name as string,
        monitorId: deleteMonitor.monitorId as string,
        onClose: onCloseDeleteDialog,
        leastDestructiveRef: cancelRef,
        mutate: mutate,
      })}
      {GlobalFilter({ globalFilter, setGlobalFilter })}
      <Box
        overflow="auto"
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
            background: useColorModeValue("#E2E8F0", "#1A202C"),
          },
        }}
      >
        <Table {...getTableProps()}>
          <Thead>
            {headerGroups.map((headerGroup) => (
              <Tr {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map((column) => {
                  if (column.id === "filter-column") {
                    column.toggleHidden(true);
                  }
                  return (
                    <Th
                      {...column.getHeaderProps()}
                      fontSize="sm"
                      fontWeight="medium"
                      borderColor={tableBorderColor}
                    >
                      {column.render("Header")}
                    </Th>
                  );
                })}
              </Tr>
            ))}
          </Thead>
          <Tbody {...getTableBodyProps()}>
            {page.map((row, i) => {
              prepareRow(row);
              return (
                <Tr {...row.getRowProps()}>
                  {row.cells.map((cell) => {
                    return (
                      <Td
                        {...cell.getCellProps()}
                        borderColor={tableBorderColor}
                      >
                        {cell.render("Cell")}{" "}
                      </Td>
                    );
                  })}
                </Tr>
              );
            })}
          </Tbody>
        </Table>
      </Box>
    </Box>
  );
}
