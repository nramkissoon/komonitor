import { Button } from "@chakra-ui/react";
import { forwardRef } from "@chakra-ui/system";
import Pagination from "@choc-ui/paginator";
import React, { LegacyRef } from "react";

interface TablePaginationProps {
  pageIndex: number;
  pageSize: number;
  globalFilteredRowsLength: number;
  globalFilter: any;
  goToPage: (updater: number | ((pageIndex: number) => number)) => void;
}

export function TablePagination(props: TablePaginationProps) {
  const {
    pageIndex,
    pageSize,
    globalFilteredRowsLength,
    goToPage,
    globalFilter,
  } = props;

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
    goToPage(0);
  }, [globalFilter]);

  return (
    <Pagination
      responsive
      hideOnSinglePage
      showTotal={(total) => (
        <Button
          fontWeight="normal"
          size="sm"
          _hover={{ cursor: "default" }}
        >{`${total} Total`}</Button>
      )}
      defaultCurrent={pageIndex + 1}
      current={pageIndex + 1} // 0 based index
      pageSize={pageSize}
      total={globalFilteredRowsLength}
      itemRender={itemRender}
      colorScheme="gray"
      onChange={(p) => {
        goToPage((p as number) - 1); // to get 0 based index
      }}
      paginationProps={{
        display: "flex",
        mt: "1em",
      }}
    />
  );
}
