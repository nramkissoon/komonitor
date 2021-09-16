import { Tr } from "@chakra-ui/react";
import { Row } from "react-table";
import { RowProps } from "./Overview-Table";

export const OverviewTableRow = (props: Row<RowProps>) => {
  return <Tr {...props.getRowProps()}></Tr>;
};
