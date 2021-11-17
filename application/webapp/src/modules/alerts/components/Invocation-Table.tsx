import { AlertInvocation } from "project-types";
import { Column } from "react-table";
import { CommonOverviewTable } from "../../../common/components/Overview-Table";
import {
  AlertRecipientsCell,
  AlertSeverityCell,
  GenericMonitorNameCell,
  SimpleTimestampCell,
} from "../../../common/components/Table-Cell";
import { itemIdToDisplayStringInTableCell } from "../../../common/utils";

interface RowProps {
  timestamp: number;
  severity: string;
  recipients: string[];
  monitorType: string;
  monitor: {
    id: string;
    name: string;
  };
  filterString: string;
}

function rowPropsGeneratorFunction(invocations: AlertInvocation[]): RowProps[] {
  return invocations
    ? invocations.map((invocation) => {
        const { severity, recipients } = invocation.alert;
        const { monitor_id, name, url } = invocation.monitor;
        return {
          timestamp: invocation.timestamp,
          severity: severity,
          recipients: recipients,
          monitorType: itemIdToDisplayStringInTableCell(monitor_id),
          monitor: {
            id: monitor_id,
            name: name,
          },
          filterString: [
            ...recipients,
            name,
            severity,
            url,
            new Date(invocation.timestamp).toUTCString(),
          ].join(" "),
        };
      })
    : [];
}

interface InvocationTableProps {
  invocations: AlertInvocation[] | undefined;
}

export function InvocationTable(props: InvocationTableProps) {
  const { invocations } = props;

  const columns: Column[] = [
    { id: "filter-column", filter: "includes", accessor: "filterString" },
    {
      Header: "Timestamp",
      accessor: "timestamp",
      Cell: (props) => SimpleTimestampCell({ timestamp: props.cell.value }),
    },
    {
      Header: "Monitor",
      accessor: "monitor",
      Cell: (props) => GenericMonitorNameCell(props.cell.value),
      disableSortBy: true,
    },
    { Header: "Monitor Type", accessor: "monitorType" },

    {
      Header: "Severity",
      accessor: "severity",
      Cell: (props) => AlertSeverityCell({ severity: props.cell.value }),
    },
    {
      Header: "Recipients",
      disableSortBy: true,
      accessor: "recipients",
      Cell: (props) => AlertRecipientsCell({ recipients: props.cell.value }),
    },
  ];

  return (
    <>
      {CommonOverviewTable<RowProps>({
        data: {
          dependencies: [invocations],
          dependenciesIsLoading: invocations === undefined,
          rowPropsGeneratorFunction: rowPropsGeneratorFunction,
        },
        columns: columns,
        itemType: "Alert Invocations",
      })}
    </>
  );
}
