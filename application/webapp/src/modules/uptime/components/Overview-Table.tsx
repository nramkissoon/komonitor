import { SearchIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  Flex,
  Input,
  InputGroup,
  InputGroupProps,
  InputLeftElement,
  InputProps,
  Spacer,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  useColorModeValue,
} from "@chakra-ui/react";
import Pagination from "@choc-ui/paginator";
import {
  UptimeMonitor,
  UptimeMonitorStatus,
  UptimeMonitorWithStatuses,
} from "project-types";
import React, { forwardRef, LegacyRef } from "react";
import {
  Column,
  useAsyncDebounce,
  useGlobalFilter,
  usePagination,
  useSortBy,
  useTable,
} from "react-table";
import { useSWRConfig } from "swr";
import {
  regionToLocationStringMap,
  timeAgo,
} from "../../../common/client-utils";
import { TableSortColumnUi } from "../../../common/components/Table-Sort-Column-UI";
import { createMonitorDataWithStatus } from "../utils";
import { MonitorDeleteDialog } from "./Delete-Monitor-Dialog";
import { ActionsCell, DescriptionCell, StatusCell } from "./Table-Cell";

interface TableProps {
  statusesMap: { [monitorId: string]: UptimeMonitorStatus[] };
  monitors: UptimeMonitor[];
}

export interface RowProps {
  description: {
    monitorId: string;
    name: string;
    url: string;
    region: string;
  };
  lastChecked: string;
  status: string;
  uptime: string;
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
  return ((up / statuses.length) * 100).toFixed(2).toString() + "%";
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
  const now = Date.now();
  return {
    description: {
      monitorId: data.monitor_id,
      name: data.name,
      url: data.url,
      region: regionToLocationStringMap[data.region],
    },
    lastChecked: mostRecentStatus
      ? timeAgo.format(now - (now - mostRecentStatus.timestamp))
      : "N/A",
    status: data.paused
      ? "paused"
      : mostRecentStatus
      ? mostRecentStatus.status
      : "Pending Data",
    uptime: calculateUptimeString(data.statuses),
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

export function OverviewTable(props: TableProps) {
  // Setup for delete dialog
  let { mutate } = useSWRConfig();
  let [deleteMonitor, setDeleteMonitor] = React.useState({} as any);
  const onCloseDeleteDialog = () => setDeleteMonitor({});
  const cancelRef = React.useRef(true);
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
        Cell: (props) => StatusCell({ status: props.cell.value }),
      },
      {
        Header: "Uptime",
        accessor: "uptime",
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
    globalFilteredRows,
    toggleSortBy,
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
    useSortBy,
    usePagination
  );

  // Pagination setup
  const Prev = forwardRef((props, ref: LegacyRef<HTMLButtonElement>) => (
    <Button ref={ref} {...props}>
      Prev
    </Button>
  ));
  const Next = forwardRef((props, ref: LegacyRef<HTMLButtonElement>) => (
    <Button ref={ref} {...props}>
      Next
    </Button>
  ));
  const itemRender = (_: number | undefined, type?: string | undefined) => {
    if (type === "prev") {
      return Prev;
    }
    if (type === "next") {
      return Next;
    }
  };
  React.useEffect(() => {
    gotoPage(0);
  }, [globalFilter]);

  // this is defined here to avoid adding more hook calls as rows are added
  const tableBorderColor = useColorModeValue("gray.100", "gray.700");

  return (
    <Box
      w="100%"
      shadow="md"
      bg={useColorModeValue("white", "#0f131a")}
      borderRadius="md"
      p="1.5em"
      mb="2em"
    >
      {MonitorDeleteDialog({
        isOpen: deleteMonitor.monitorId !== undefined,
        name: deleteMonitor.name as string,
        monitorId: deleteMonitor.monitorId as string,
        onClose: onCloseDeleteDialog,
        leastDestructiveRef: cancelRef,
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
                      <Flex>
                        <Box my="auto">{column.render("Header")}</Box>
                        {column.id !== "actions" ? (
                          <>
                            <Spacer />
                            <TableSortColumnUi
                              column={column}
                              toggleSortBy={toggleSortBy}
                            />
                          </>
                        ) : (
                          <></>
                        )}
                      </Flex>
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
      <Box>
        <Pagination
          responsive
          hideOnSinglePage
          showTotal={(total) => (
            <Button
              fontWeight="normal"
              size="sm"
              _hover={{ cursor: "default" }}
            >{`${total} Monitors`}</Button>
          )}
          defaultCurrent={pageIndex + 1}
          current={pageIndex + 1} // 0 based index
          pageSize={pageSize}
          total={globalFilteredRows.length}
          itemRender={itemRender}
          colorScheme="gray"
          onChange={(p) => {
            gotoPage((p as number) - 1); // to get 0 based index
          }}
          paginationProps={{
            display: "flex",
            mt: "1em",
          }}
        />
      </Box>
    </Box>
  );
}
