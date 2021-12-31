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
import { useUserTimezoneAndOffset } from "../../user/client";

interface RowProps {
  severity: string;
  recipients: string[];
  monitorType: string;
  monitor: {
    id: string;
    name: string;
  };
  timestampAndOngoing: {
    timestamp: number;
    ongoing: boolean;
  };
  filterString: string;
}

function rowPropsGeneratorFunction(invocations: AlertInvocation[]): RowProps[] {
  return invocations
    ? invocations.map((invocation) => {
        const { severity, recipients } = invocation.alert;
        const { monitor_id, name, url } = invocation.monitor;
        return {
          timestampAndOngoing: {
            timestamp: invocation.timestamp,
            ongoing: invocation.ongoing,
          },
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
  const {
    data: tzAndOffset,
    isLoading: tzPrefIsLoading,
    isError: tzPrefIsError,
  } = useUserTimezoneAndOffset();

  const columns: Column[] = [
    { id: "filter-column", filter: "includes", accessor: "filterString" },
    {
      Header: "Timestamp",
      accessor: "timestampAndOngoing",
      Cell: (props) =>
        SimpleTimestampCell({
          timestampAndOngoing: props.cell.value,
          offset: tzAndOffset?.offset ?? 0,
        }),
    },
    {
      Header: "Monitor",
      accessor: "monitor",
      Cell: (props) => GenericMonitorNameCell(props.cell.value),
      disableSortBy: true,
    },

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
