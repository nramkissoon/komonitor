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
import { UptimeMonitor } from "types";
import { MonitorDeleteDialog } from "./Delete-Monitor-Dialog";
import { ActionsCell, DescriptionCell } from "./Overview-Table-Cell";

interface TableProps {
  data: UptimeMonitor[];
}

export interface RowProps {
  description: {
    monitorId: string;
    name: string;
    url: string;
  };
  lastChecked: string;
  status: string;
  uptime: number;
  actions: {
    monitorId: string;
    name: string;
  };
  filter_string: string;
}

function createRowPropsFromUptimeMonitor(monitor: UptimeMonitor): RowProps {
  return {
    description: {
      monitorId: monitor.monitor_id,
      name: monitor.name,
      url: monitor.url,
    },
    lastChecked: "",
    status: "",
    uptime: 100,
    actions: {
      monitorId: monitor.monitor_id,
      name: monitor.name,
    },
    filter_string: [monitor.name, monitor.url].join(" "),
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
  const [deleteMonitor, setDeleteMonitor] = React.useState({} as any);
  const onCloseDeleteDialog = () => setDeleteMonitor({});
  const cancelRef = React.useRef();
  const openDeleteDialog = (name: string, id: string) =>
    setDeleteMonitor({ name: name, monitorId: id });

  // Setup for table
  const data = React.useMemo(
    () => props.data.map((monitor) => createRowPropsFromUptimeMonitor(monitor)),
    [props.data]
  );
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
        accessor: "filter_string",
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
      initialState: { pageIndex: 0, pageSize: 20 },
    },
    useGlobalFilter,
    usePagination
  );

  return (
    <Box
      w="100%"
      shadow="lg"
      bg={useColorModeValue("gray.50", "#0f131a")}
      borderRadius="xl"
      p="1.5em"
      mb="2em"
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
          borderRadius: "10px",
        },
      }}
    >
      {MonitorDeleteDialog({
        isOpen: deleteMonitor.monitorId !== undefined,
        name: deleteMonitor.name as string,
        monitorId: deleteMonitor.monitorId as string,
        onClose: onCloseDeleteDialog,
        leastDestructiveRef: cancelRef,
      })}
      {GlobalFilter({ globalFilter, setGlobalFilter })}
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
                    borderColor={useColorModeValue("gray.300", "gray.700")}
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
                      borderColor={useColorModeValue("gray.300", "gray.700")}
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
  );
}
