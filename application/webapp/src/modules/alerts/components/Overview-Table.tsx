import { Alert } from "project-types";
import { Column } from "react-table";
import {
  DeleteDialog,
  useDeleteDialog,
} from "../../../common/components/Delete-Dialog";
import { CommonOverviewTable } from "../../../common/components/Overview-Table";
import { ActionsCell } from "../../../common/components/Table-Cell";
import { deleteAlert } from "../client";

interface RowProps {
  name: string;
  severity: string;
  type: string;
  state: string;
  filterString: string;
  actions: {
    itemId: string;
    itemName: string;
  };
}

function rowPropsGeneratorFunction(alerts: Alert[]): RowProps[] {
  return alerts
    ? alerts.map((alert) => ({
        name: alert.name,
        severity: alert.severity,
        type: alert.type,
        state: alert.state,
        filterString: [
          alert.name,
          alert.description,
          alert.severity,
          alert.type,
          alert.state,
        ].join(" "),
        actions: {
          itemName: alert.name,
          itemId: alert.alert_id,
        },
      }))
    : [];
}

interface OverViewTableProps {
  alerts: Alert[] | undefined;
  isLoading: boolean;
}

export function OverviewTable(props: OverViewTableProps) {
  const { alerts, isLoading } = props;
  const {
    openDeleteDialog,
    mutate,
    deleteItem,
    setDeleteItem,
    onCloseDeleteDialog,
    cancelRef,
  } = useDeleteDialog();

  const columns: Column[] = [
    { id: "filter-column", filter: "includes", accessor: "filterString" },
    { Header: "Alert", accessor: "name" },
    {
      Header: "Actions",
      accessor: "actions",
      disableSortBy: true,
      Cell: (props) =>
        ActionsCell({
          cellValues: props.cell.value,
          itemType: "alert",
          baseItemUrl: "app/alerts",
          openDeleteDialog: openDeleteDialog,
        }),
    },
  ];

  return (
    <>
      {DeleteDialog({
        isOpen: deleteItem.id !== undefined,
        itemName: deleteItem.name as string,
        itemId: deleteItem.id as string,
        onClose: onCloseDeleteDialog,
        leastDestructiveRef: cancelRef,
        mutate: mutate,
        mutateApiUrl: "/api/alerts",
        deleteApiFunc: deleteAlert,
        itemType: "alert",
      })}
      {CommonOverviewTable<RowProps>({
        data: {
          dependencies: [alerts],
          dependenciesIsLoading: isLoading,
          rowPropsGeneratorFunction: rowPropsGeneratorFunction,
        },
        columns: columns,
        itemType: "Alerts",
      })}
    </>
  );
}
