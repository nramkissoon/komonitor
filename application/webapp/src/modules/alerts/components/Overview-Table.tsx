import { useToast } from "@chakra-ui/react";
import { Alert } from "project-types";
import { Column } from "react-table";
import { CommonOverviewTable } from "../../../common/components/Overview-Table";
import {
  ActionsCell,
  AlertSeverityCell,
} from "../../../common/components/Table-Cell";
import { useUptimeMonitors } from "../../uptime/client";
import { AlertDeleteDialog, useDeleteDialog } from "./Alert-Delete-Dialog";
import { AlertNameAndTypeCell, AlertStateCell } from "./Table-Cell";

interface RowProps {
  nameAndType: {
    name: string;
    id: string;
    type: string;
  };
  severity: string;
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
        nameAndType: {
          name: alert.name,
          id: alert.alert_id,
          type: alert.type,
        },
        severity: alert.severity,
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

interface OverviewTableProps {
  alerts: Alert[] | undefined;
  isLoading: boolean;
}

export function OverviewTable(props: OverviewTableProps) {
  const { alerts, isLoading } = props;
  const errorToast = useToast();
  const {
    monitors: uptimeMonitors,
    isError: monitorsIsError,
    isLoading: monitorsIsLoading,
  } = useUptimeMonitors();
  const postErrorToast = (message: string) =>
    errorToast({
      title: "Unable to perform action",
      description: message,
      status: "error",
      duration: 9000,
      isClosable: true,
      variant: "solid",
      position: "top",
    });
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
    {
      Header: "Alert",
      accessor: "nameAndType",
      Cell: (props) => AlertNameAndTypeCell({ ...props.cell.value }),
    },
    {
      Header: "State",
      accessor: "state",
      Cell: (props) => AlertStateCell({ state: props.cell.value }),
    },
    {
      Header: "Severity",
      accessor: "severity",
      Cell: (props) => AlertSeverityCell({ severity: props.cell.value }),
    },
    {
      Header: "Actions",
      accessor: "actions",
      disableSortBy: true,
      Cell: (props) =>
        ActionsCell({
          cellValues: props.cell.value,
          itemType: "alert",
          baseItemUrl: "/app/alerts",
          openDeleteDialog: openDeleteDialog,
        }),
    },
  ];

  return (
    <>
      {AlertDeleteDialog({
        isOpen: deleteItem.id !== undefined,
        itemName: deleteItem.name as string,
        itemId: deleteItem.id as string,
        onClose: onCloseDeleteDialog,
        leastDestructiveRef: cancelRef,
        mutate: mutate,
        attachedMonitors: uptimeMonitors
          ? uptimeMonitors.filter(
              (monitor) => deleteItem.id === monitor.alert_id
            )
          : [],
        onError: postErrorToast,
      })}
      {CommonOverviewTable<RowProps>({
        data: {
          dependencies: [alerts], // pass in length to rerender if total items have changed
          dependenciesIsLoading: isLoading,
          rowPropsGeneratorFunction: rowPropsGeneratorFunction,
        },
        columns: columns,
        itemType: "Alerts",
      })}
    </>
  );
}
