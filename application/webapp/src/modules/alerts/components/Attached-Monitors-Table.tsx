import { useToast } from "@chakra-ui/toast";
import { UptimeMonitor } from "project-types";
import { Column } from "react-table";
import { CommonOverviewTable } from "../../../common/components/Overview-Table";
import {
  getItemIdPrefix,
  itemIdToDisplayStringInTableCell,
  ITEM_ID_PREFIXES_TO_ITEM_TYPE,
} from "../../../common/utils";
import { detachAlertFromUptimeMonitor } from "../../uptime/client";
import { DetachDialog, useDetachDialog } from "./Detach-Dialog";

interface RowProps {
  monitorType: string;
  nameAndId: {
    name: string;
    id: string;
  };
  region: string;
  failuresBeforeAlert: number;
  actions: {
    alertId: string;
    item: any;
  };
  filterString: string;
}

// TODO add browser and lighthouse
function rowPropsGeneratorFunction(
  alertId: string,
  monitors: UptimeMonitor[]
): RowProps[] {
  return monitors
    ? monitors.map((monitor) => ({
        monitorType: itemIdToDisplayStringInTableCell(monitor.monitor_id),
        nameAndId: {
          name: monitor.name,
          id: monitor.monitor_id,
        },
        region: monitor.region,
        failuresBeforeAlert: monitor.failures_before_alert as number,
        actions: {
          alertId: alertId,
          item: monitor,
        },
        filterString: [
          ITEM_ID_PREFIXES_TO_ITEM_TYPE[getItemIdPrefix(monitor.monitor_id)],
          monitor.name,
          monitor.url,
          monitor.failures_before_alert,
          monitor.region,
        ].join(" "),
      }))
    : [];
}

interface AttachedMonitorsTableProps {
  alertId: string;
  // TODO update later
  attachedMonitors: UptimeMonitor[] | undefined;
  isLoading: boolean;
}

// TODO | lighthouse | browser
function getDetachFunctionFromMonitor(monitor: UptimeMonitor) {
  const id = monitor?.monitor_id;
  if (id === undefined) return null;
  const type = ITEM_ID_PREFIXES_TO_ITEM_TYPE[getItemIdPrefix(id)];
  switch (type) {
    case "uptime-monitor":
      return detachAlertFromUptimeMonitor;
    default:
      return null;
  }
}

export function AttachedMonitorsTable(props: AttachedMonitorsTableProps) {
  const { alertId, attachedMonitors, isLoading } = props;
  const errorToast = useToast();
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
    itemToDetach,
    setItemToDetach,
    onCloseDetachDialog,
    cancelRef,
    openDetachDialog,
  } = useDetachDialog();

  const columns: Column[] = [
    { id: "filter-column", filter: "includes", accessor: "filterString" },
    {
      Header: "Monitor",
      accessor: "nameAndId",
      Cell: (props) => <></>,
      disableSortBy: true,
    },
    { Header: "Monitor Type", accessor: "monitorType" },
    { Header: "Region", accessor: "region" },
    { Header: "Failures before alert", accessor: "failuresBeforeAlert" },
    {
      Header: "Actions",
      accessor: "actions",
      Cell: (props) => <></>,
      disableSortBy: true,
    },
  ];

  return (
    <>
      {DetachDialog({
        isOpen: itemToDetach !== undefined,
        item: itemToDetach,
        alertId: alertId,
        onClose: onCloseDetachDialog,
        leastDestructiveRef: cancelRef,
        detachApiFunc: getDetachFunctionFromMonitor(itemToDetach),
        onError: postErrorToast,
      })}
      {CommonOverviewTable<RowProps>({
        data: {
          dependencies: [alertId, attachedMonitors],
          dependenciesIsLoading: isLoading,
          rowPropsGeneratorFunction: rowPropsGeneratorFunction,
        },
        columns: columns,
        itemType: "monitors using this alert",
      })}
    </>
  );
}
