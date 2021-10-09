import { AlertInvocation } from "project-types";
import { Column } from "react-table";
import { CommonOverviewTable } from "../../../common/components/Overview-Table";
import {
  AlertRecipientsCell,
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

function rowPropsGeneratorFunction(invocations: AlertInvocation[]): RowProps[] {
  return invocations
    ? invocations.map((invocation) => ({
        timestamp: invocation.timestamp,
        type: invocation.alert.type,
        severity: invocation.alert.severity,
        recipients: invocation.alert.recipients,
        filterString: [
          invocation.alert.severity,
          ...invocation.alert.recipients,
          invocation.alert.type,
        ].join(" "),
      }))
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
