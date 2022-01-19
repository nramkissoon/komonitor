import { SearchIcon } from "@chakra-ui/icons";
import {
  Input,
  InputGroup,
  InputGroupProps,
  InputLeftElement,
  InputProps,
} from "@chakra-ui/input";
import {
  Box,
  Fade,
  Flex,
  Heading,
  ScaleFade,
  Spacer,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  useColorModeValue,
} from "@chakra-ui/react";
import { UptimeMonitorStatus } from "project-types";
import React from "react";
import {
  Column,
  useAsyncDebounce,
  useGlobalFilter,
  usePagination,
  useSortBy,
  useTable,
} from "react-table";
import { getTimeString } from "../../../common/client-utils";
import { JSONDownloadButton } from "../../../common/components/JSON-Download-Button";
import { LoadingSpinner } from "../../../common/components/Loading-Spinner";
import { TablePagination } from "../../../common/components/Table-Pagination";
import { TableSortColumnUi } from "../../../common/components/Table-Sort-Column-UI";
import { ResponseTimeCellProps, StatusCell, TimestampCell } from "./Table-Cell";

export interface RowProps {
  status: string;
  responseTime: number;
  timestamp: number;
  filterString: string;
}

interface TableProps {
  monitorId: string;
  statuses: UptimeMonitorStatus[] | undefined;
  offset: number;
}

function createRowPropsFromMonitorStatus(
  status: UptimeMonitorStatus,
  offset: number
): RowProps {
  return {
    status: status.status ?? "No Data",
    responseTime: (status as any).latency // TODO revert latency status
      ? (status as any).latency
      : status.response.timings.phases.total ?? -1,
    timestamp: status.timestamp,
    filterString: [status.status, getTimeString(offset, status.timestamp)].join(
      " "
    ),
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
        placeholder="Search Monitor Statuses..."
        {...styles}
      />
    </InputGroup>
  );
}

export default function StatusTable(props: TableProps) {
  const { monitorId, statuses, offset } = props;

  const data = React.useMemo(() => {
    return statuses
      ? statuses
          .map((status) => createRowPropsFromMonitorStatus(status, offset))
          .sort()
          .reverse()
      : [];
  }, [statuses, offset]);

  const tableColumns = React.useMemo(
    (): Column[] => [
      {
        Header: "Status",
        id: "status",
        accessor: "status",
        Cell: (props) => StatusCell({ status: props.cell.value }),
      },
      {
        Header: "Response Time",
        accessor: "responseTime",
        Cell: (props) =>
          ResponseTimeCellProps({ responseTime: props.cell.value }),
      },
      {
        Header: "Timestamp",
        accessor: "timestamp",
        Cell: (props) =>
          TimestampCell({ timestamp: props.cell.value, offset: offset }),
      },
      {
        id: "filter-column",
        filter: "includes",
        accessor: "filterString",
      },
    ],
    [offset]
  );

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    page,
    gotoPage,
    setGlobalFilter,
    globalFilteredRows,
    toggleSortBy,
    state: { pageIndex, pageSize, globalFilter },
  } = useTable(
    {
      columns: tableColumns,
      data: data ? data : [],
      autoResetSortBy: false,
      autoResetPage: false,
      initialState: { pageIndex: 0, pageSize: 8 },
    },
    useGlobalFilter,
    useSortBy,
    usePagination
  );

  // this is defined here to avoid adding more hook calls as rows are added
  const tableBorderColor = useColorModeValue("gray.100", "gray.700");

  return (
    <Box
      w="100%"
      shadow="lg"
      bg={useColorModeValue("white", "#0f131a")}
      borderRadius="xl"
      p="1.5em"
      mb="2em"
    >
      <Heading textAlign="center" size="lg" mb=".7em">
        Monitor Statuses
      </Heading>
      <Flex flexDir="row" justifyContent="space-between">
        {GlobalFilter({ globalFilter, setGlobalFilter })}
        <JSONDownloadButton
          data={statuses ? statuses : {}}
          filename={"monitor-statuses.json"}
        />
      </Flex>
      {statuses ? (
        <ScaleFade in={statuses !== undefined} initialScale={0.8}>
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
                            {column.id !== "status" ? (
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
            <TablePagination
              pageIndex={pageIndex}
              pageSize={pageSize}
              globalFilteredRowsLength={globalFilteredRows.length}
              globalFilter={globalFilter}
              goToPage={gotoPage}
            />
          </Box>
        </ScaleFade>
      ) : (
        <Fade in={!statuses} delay={0.2}>
          {LoadingSpinner()}
        </Fade>
      )}
    </Box>
  );
}
