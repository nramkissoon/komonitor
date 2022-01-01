import { AlertInvocation } from "project-types";
import { Column } from "react-table";
import { CommonOverviewTable } from "../../../common/components/Overview-Table";
import {
  AlertRecipientsCell,
  AlertSeverityCell,
  SimpleTimestampCell,
} from "../../../common/components/Table-Cell";

interface RowProps {
  type: string;
  severity: string;
  recipients: string[];
  filterString: string;
  timestampAndOngoing: {
    timestamp: number;
    ongoing: boolean;
  };
}

function rowPropsGeneratorFunction(invocations: AlertInvocation[]): RowProps[] {
  return invocations
    ? invocations.map((invocation) => ({
        timestampAndOngoing: {
          timestamp: invocation.timestamp,
          ongoing: invocation.ongoing,
        },

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
  tzOffset: number;
}
export function InvocationTable(props: InvocationTableProps) {
  const { invocations, tzOffset } = props;

  invocations?.sort((a, b) => b.timestamp - a.timestamp); // most recent invocation at top

  const columns: Column[] = [
    { id: "filter-column", filter: "includes", accessor: "filterString" },
    {
      Header: "Timestamp",
      accessor: "timestampAndOngoing",
      Cell: (props) =>
        SimpleTimestampCell({
          timestampAndOngoing: props.cell.value,
          offset: tzOffset,
        }),
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
          dependencies: [invocations, tzOffset],
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
