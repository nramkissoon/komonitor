import { IconButton } from "@chakra-ui/button";
import { useColorModeValue } from "@chakra-ui/color-mode";
import { TriangleDownIcon, TriangleUpIcon } from "@chakra-ui/icons";
import { Flex } from "@chakra-ui/layout";
import { HeaderGroup } from "react-table";

interface TableSortColumnUiProps {
  column: HeaderGroup<{}>;
  toggleSortBy: (
    columnId: string,
    descending: boolean,
    isMulti: boolean
  ) => void;
}

/**
 * If true, the column is sorted descending
    If false, the column is sorted ascending
    If undefined, the column is not currently being sorted
 */
function sortedAsc(b: boolean | undefined) {
  if (b === undefined) return false;
  if (b) return false;
  return true;
}

export function TableSortColumnUi(props: TableSortColumnUiProps) {
  const { column, toggleSortBy } = props;
  const selectedColor = useColorModeValue("blue.200", "blue.600");
  return (
    <Flex>
      <IconButton
        mr=".5em"
        size="sm"
        colorScheme="gray"
        background={column.isSortedDesc ? selectedColor : ""}
        aria-label="sort descending"
        icon={<TriangleDownIcon />}
        onClick={() => {
          column.isSortedDesc
            ? column.clearSortBy()
            : toggleSortBy(column.id, true, false);
        }}
      />
      <IconButton
        size="sm"
        colorScheme="gray"
        background={sortedAsc(column.isSortedDesc) ? selectedColor : ""}
        aria-label="sort ascending"
        icon={<TriangleUpIcon />}
        onClick={() => {
          sortedAsc(column.isSortedDesc)
            ? column.clearSortBy()
            : toggleSortBy(column.id, false, false);
        }}
      />
    </Flex>
  );
}
