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
  chakra,
  Fade,
  Flex,
  Grid,
  GridItem,
  Heading,
  Spacer,
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
  useSortBy,
  useTable,
} from "react-table";
import { toExternalUptimeStatusObject, UptimeMonitorStatus } from "utils";
import { getTimeString, timeAgo } from "../../../common/client-utils";
import { JSONDownloadButton } from "../../../common/components/JSON-Download-Button";
import { JsonViewer } from "../../../common/components/Json-Viewer";
import { LoadingSpinner } from "../../../common/components/Loading-Spinner";
import { TablePagination } from "../../../common/components/Table-Pagination";
import { TableSortColumnUi } from "../../../common/components/Table-Sort-Column-UI";
import { ResponseCell, StatusCell, TimestampCell } from "./Table-Cell";

export interface RowProps {
  status: string;
  responseTime: number;
  timestamp: number;
  response: {
    code: number;
    message?: string;
  };
  statusObj: UptimeMonitorStatus;
  filterString: string;
}

interface TableProps {
  monitorId: string;
  statuses: UptimeMonitorStatus[] | undefined;
  offset: number;
  since: number;
}

function createRowPropsFromMonitorStatus(
  status: UptimeMonitorStatus,
  offset: number
): RowProps {
  return {
    status: status.status ?? "No Data",
    responseTime: (status as any).latency // TODO revert latency status
      ? (status as any).latency
      : status.response.timings.phases.firstByte ?? -1,
    response: {
      code: status.response.statusCode,
      message: status.response.statusMessage,
    },
    timestamp: status.timestamp,
    filterString: [
      status.status,
      getTimeString(offset, status.timestamp / 1000),
      status.response.statusCode,
      status.response.statusMessage,
    ].join(" "),
    statusObj: status,
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
    maxW: ["500px"],
    mr: "20px",
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
  const { monitorId, statuses, offset, since } = props;
  const [statusToView, setStatusToView] = React.useState<object | undefined>(
    undefined
  );

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
        Header: "Response Code",
        accessor: "response",
        disableSortBy: true,
        Cell: (props) => ResponseCell({ ...props.cell.value }),
      },
      {
        Header: "Timestamp",
        accessor: "timestamp",
        Cell: (props) =>
          TimestampCell({ timestamp: props.cell.value, offset: offset }),
      },
      {
        id: "statusObj",
        accessor: "statusObj",
        Cell: (props) => {
          "hidden";
        },
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
      initialState: { pageIndex: 0, pageSize: 15 },
    },
    useGlobalFilter,
    useSortBy,
    usePagination
  );

  // this is defined here to avoid adding more hook calls as rows are added
  const tableBorderColor = useColorModeValue("gray.100", "gray.700");
  const rowHoverBg = useColorModeValue("white", "gray.950");

  return (
    <>
      <Heading textAlign="left" size="lg" mb=".7em" as="h2" fontWeight="medium">
        Monitor Statuses{" "}
        <chakra.span fontSize="lg" color="gray.500">
          ({timeAgo.format(Date.now() - since)})
        </chakra.span>
      </Heading>
      <Grid templateColumns={"repeat(2, 1fr)"} gap={4}>
        <GridItem colSpan={1} w="100%" borderRadius="lg">
          <Flex flexDir="row" justifyContent="space-between" h="50px">
            {GlobalFilter({ globalFilter, setGlobalFilter })}
            <JSONDownloadButton
              data={
                statuses
                  ? statuses.map((s) => toExternalUptimeStatusObject(s))
                  : {}
              }
              filename={"monitor-statuses.json"}
            />
          </Flex>
          {statuses ? (
            <Flex justifyContent="space-between" flexDir="column">
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
                <Table {...getTableProps()} fontSize="md">
                  <Thead>
                    {headerGroups.map((headerGroup) => (
                      <Tr {...headerGroup.getHeaderGroupProps()}>
                        {headerGroup.headers.map((column) => {
                          if (
                            column.id === "filter-column" ||
                            column.id === "statusObj"
                          ) {
                            column.toggleHidden(true);
                          }
                          return (
                            <Th
                              {...column.getHeaderProps()}
                              fontSize="sm"
                              fontWeight="medium"
                              borderColor={tableBorderColor}
                              p="5px"
                            >
                              <Flex>
                                <Box my="auto">{column.render("Header")}</Box>
                                {!column.disableSortBy ? (
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
                        <Tr
                          {...row.getRowProps()}
                          bg={
                            row.values.statusObj.timestamp ===
                            (statusToView ?? ({} as any)).timestamp
                              ? rowHoverBg
                              : "inherit"
                          }
                          _hover={{
                            bg: rowHoverBg,
                            cursor: "pointer",
                          }}
                          onClick={() => {
                            setStatusToView(
                              toExternalUptimeStatusObject(row.values.statusObj)
                            );
                          }}
                        >
                          {row.cells.map((cell) => {
                            return (
                              <Td
                                {...cell.getCellProps()}
                                borderColor={tableBorderColor}
                                p="5px"
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
            </Flex>
          ) : (
            <Fade in={!statuses} delay={0.2}>
              {LoadingSpinner()}
            </Fade>
          )}
        </GridItem>
        <GridItem colSpan={1}>
          {statusToView && (
            <>
              <Flex h="50px"></Flex>
              <Box
                w="2xl"
                overflowX="scroll"
                h={"2xl"}
                float="right"
                py="20px"
                rounded="sm"
                bg={useColorModeValue("white", "gray.950")}
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
                  "&::-webkit-scrollbar-corner": {
                    background: "rgba(0,0,0,0)",
                  },
                }}
              >
                <JsonViewer json={JSON.stringify(statusToView, null, 2)} />
              </Box>
            </>
          )}
          {!statusToView && (
            <Flex alignItems={"center"} justifyContent="center" h="full">
              <Box fontSize="lg">Select a status in the table to view.</Box>
            </Flex>
          )}
        </GridItem>
      </Grid>
    </>
  );
}
