import { SearchIcon } from "@chakra-ui/icons";
import {
  Box,
  BoxProps,
  Fade,
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
import React from "react";
import {
  Column,
  useAsyncDebounce,
  useGlobalFilter,
  usePagination,
  useSortBy,
  useTable,
} from "react-table";
import { LoadingSpinner } from "./Loading-Spinner";
import { TablePagination } from "./Table-Pagination";
import { TableSortColumnUi } from "./Table-Sort-Column-UI";

function GlobalFilter(props: {
  globalFilter: any;
  setGlobalFilter: (filterValue: any) => void;
  itemType: string;
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
        placeholder={"Search " + props.itemType + "..."}
        {...styles}
      />
    </InputGroup>
  );
}

interface OverviewTableProps {
  data: {
    dependencies: any[];
    dependenciesIsLoading: boolean;
    rowPropsGeneratorFunction: (...args: any[]) => any;
  };
  columns: Column[];
  itemType: string;
  containerBoxProps?: BoxProps;
  jsonDownLoad?: React.ReactElement;
  jsonViewProps: {
    objToView: any;
    onClick: (obj: any) => void;
    checkFunc: (obj: any) => any;
  };
}

export function CommonOverviewTable<RowProps>(props: OverviewTableProps) {
  const {
    data,
    columns,
    itemType,
    containerBoxProps,
    jsonDownLoad,
    jsonViewProps,
  } = props;

  const rows: RowProps[] = React.useMemo(
    () => data.rowPropsGeneratorFunction(...data.dependencies),
    [...data.dependencies]
  );

  const tableColumns = React.useMemo((): Column[] => columns, []);

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
      data: rows ? (rows as any) : [],
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
    <Box>
      <Flex flexDir="row" justifyContent="space-between" h="50px">
        {GlobalFilter({ globalFilter, setGlobalFilter, itemType })}
        {jsonDownLoad}
      </Flex>
      {!data.dependenciesIsLoading ? (
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
                        column.id === "obj"
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
                        jsonViewProps.checkFunc(row.values.obj) ===
                        jsonViewProps.checkFunc(jsonViewProps.objToView)
                          ? rowHoverBg
                          : "inherit"
                      }
                      _hover={{
                        bg: rowHoverBg,
                        cursor: "pointer",
                      }}
                      onClick={() => {
                        jsonViewProps.onClick(row.values.obj);
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
        <Fade in={data.dependenciesIsLoading} delay={0.2}>
          {LoadingSpinner()}
        </Fade>
      )}
    </Box>
  );
}
