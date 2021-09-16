import { Input, Table, Tbody, Td, Th, Thead, Tr } from "@chakra-ui/react";
import React from "react";
import {
  Column,
  useAsyncDebounce,
  useGlobalFilter,
  usePagination,
  useTable,
} from "react-table";
import { UptimeMonitor } from "types";
import { DescriptionCell } from "./Overview-Table-Cell";

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
  return (
    <Input
      type="text"
      value={value || ""}
      onChange={(e) => {
        setValue(e.target.value);
        onChange(e.target.value);
      }}
      placeholder="Search Monitors..."
    />
  );
}

export function OverviewTable(props: TableProps) {
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
    <>
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
                  <Th {...column.getHeaderProps()}>
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
                    <Td {...cell.getCellProps()}>{cell.render("Cell")} </Td>
                  );
                })}
              </Tr>
            );
          })}
        </Tbody>
      </Table>
    </>
  );
}