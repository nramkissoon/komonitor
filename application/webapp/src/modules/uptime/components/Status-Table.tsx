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
import { LoadingSpinner } from "../../../common/components/Loading-Spinner";
import { TablePagination } from "../../../common/components/Table-Pagination";
import { TableSortColumnUi } from "../../../common/components/Table-Sort-Column-UI";

export interface RowProps {
  status: string;
  responseTime: number;
  timestamp: number;
  filterString: string;
}

interface TableProps {
  monitorId: string;
  statuses: UptimeMonitorStatus[] | undefined;
}

function createRowPropsFromMonitorStatus(
  status: UptimeMonitorStatus
): RowProps {
  return {
    status: status.status,
    responseTime: status.latency,
    timestamp: status.timestamp,
    filterString: [status.status].join(" "),
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

export function StatusTable(props: TableProps) {
  const { monitorId, statuses } = props;

  const data = React.useMemo(() => {
    return statuses?.map((status) => createRowPropsFromMonitorStatus(status));
  }, [statuses]);

  const tableColumns = React.useMemo(
    (): Column[] => [
      {
        Header: "Status",
        id: "status",
        accessor: "status",
      },
      {
        Header: "Response Time",
        accessor: "responseTime",
      },
      {
        Header: "Timestamp",
        accessor: "timestamp",
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
      initialState: { pageIndex: 0, pageSize: 10 },
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
      {GlobalFilter({ globalFilter, setGlobalFilter })}
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
