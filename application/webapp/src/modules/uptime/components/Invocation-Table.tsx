import { Alert, AlertInvocation } from "project-types";
import { Column } from "react-table";
import { CommonOverviewTable } from "../../../common/components/Overview-Table";
import {
  AlertSeverityCell,
  SimpleTimestampCell,
} from "../../../common/components/Table-Cell";

interface RowProps {
  timestamp: number;
  type: string;
  severity: string;
  recipients: string[];
  filterString: string;
}

function rowPropsGeneratorFunction(
  invocations: AlertInvocation[],
  alert: Alert
): RowProps[] {
  return invocations && alert
    ? invocations.map((invocation) => ({
        timestamp: invocation.timestamp,
        type: alert.type,
        severity: alert.severity,
        recipients: alert.recipients,
        filterString: [alert.severity, ...alert.recipients, alert.type].join(
          " "
        ),
      }))
    : [];
}

interface InvocationTableProps {
  alert: Alert | undefined;
  invocations: AlertInvocation[] | undefined;
}

export function InvocationTable(props: InvocationTableProps) {
  const { alert, invocations } = props;

  const columns: Column[] = [
    { id: "filter-column", filter: "includes", accessor: "filterString" },
    {
      Header: "Timestamp",
      accessor: "timestamp",
      Cell: (props) => SimpleTimestampCell({ timestamp: props.cell.value }),
    },
    { Header: "Type", accessor: "type" },
    {
      Header: "Severity",
      accessor: "severity",
      Cell: (props) => AlertSeverityCell({ severity: props.cell.value }),
    },
    {
      Header: "Recipients",
      disableSortBy: true,
      accessor: "recipients",
      Cell: () => {},
    },
  ];

  return (
    <>
      {CommonOverviewTable<RowProps>({
        data: {
          dependencies: [invocations, alert],
          dependenciesIsLoading:
            alert === undefined || invocations === undefined,
          rowPropsGeneratorFunction: rowPropsGeneratorFunction,
        },
        columns: columns,
        itemType: "Alert Invocations",
        containerBoxProps: {
          py: "0",
          px: "0",
          shadow: "none",
          bg: "inherit",
          borderRadius: "none",
        },
      })}
    </>
  );
}
