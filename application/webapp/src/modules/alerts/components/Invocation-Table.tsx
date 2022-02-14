import {
  Box,
  Button,
  chakra,
  Flex,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  useColorModeValue,
  useDisclosure,
} from "@chakra-ui/react";
import React from "react";
import { AiOutlineInfoCircle } from "react-icons/ai";
import { Column } from "react-table";
import { Alert, AlertInvocation } from "utils";
import { JSONDownloadButton } from "../../../common/components/JSON-Download-Button";
import { CommonOverviewTable } from "../../../common/components/Overview-Table";
import { SimpleTimestampCell } from "../../../common/components/Table-Cell";
import { useUserTimezoneAndOffset } from "../../user/client";
import { alertTypeToBadge } from "./Alert-Type-Badges";

function InvocationObjectModal({
  invocation,
  isOpen,
  onClose,
}: {
  invocation?: AlertInvocation;
  isOpen: boolean;
  onClose: () => void;
}) {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent maxW="5xl">
        <ModalHeader>Alert Object</ModalHeader>
        <ModalCloseButton />
        <ModalBody
          overflowX="scroll"
          css={{
            "&::-webkit-scrollbar": {
              width: "10px",
              height: "10px",
            },
            "&::-webkit-scrollbar-track": {
              width: "10px",
              height: "10px",
            },
            "&::-webkit-scrollbar-thumb": {
              background: useColorModeValue("#E2E8F0", "#1A202C"),
            },
          }}
        >
          <chakra.pre>{JSON.stringify(invocation, null, 2)}</chakra.pre>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}

interface RowProps {
  monitor: {
    id: string;
    name: string;
  };
  timestampAndOngoing: {
    timestamp: number;
    ongoing: boolean;
  };
  alert: Alert;
  invocationObj: AlertInvocation;
  filterString: string;
}

function rowPropsGeneratorFunction(invocations: AlertInvocation[]): RowProps[] {
  return invocations
    ? invocations.map((invocation) => {
        const { monitor_id, name, url } = invocation.monitor;
        return {
          timestampAndOngoing: {
            timestamp: invocation.timestamp,
            ongoing: invocation.ongoing,
          },
          monitor: {
            id: monitor_id,
            name: name,
          },
          alert: invocation.alert,
          invocationObj: invocation,
          filterString: [
            name,
            new Date(invocation.timestamp).toUTCString(),
          ].join(" "),
        };
      })
    : [];
}

const AlertChannelCell = (alert: Alert) => (
  <Flex>
    {alert.channels.map((channel) => (
      <Box key={channel} mr="1em">
        {alertTypeToBadge(channel)}
      </Box>
    ))}
  </Flex>
);

const InvocationObjectCell = ({
  invocation,
  setInvocationToView,
  onOpen,
}: {
  invocation: AlertInvocation;
  setInvocationToView: React.Dispatch<
    React.SetStateAction<AlertInvocation | undefined>
  >;
  onOpen: () => void;
}) => {
  return (
    <Button
      aria-label="view alert invocation JSON object"
      rightIcon={<AiOutlineInfoCircle />}
      variant="ghost"
      colorScheme="blue"
      onClick={() => {
        setInvocationToView(invocation);
        onOpen();
      }}
      fontWeight="normal"
    >
      View Full Alert
    </Button>
  );
};

interface InvocationTableProps {
  invocations: AlertInvocation[] | undefined;
}

export function InvocationTable(props: InvocationTableProps) {
  const { invocations } = props;

  const { isOpen, onOpen, onClose } = useDisclosure();
  const [invocationToView, setInvocationToView] = React.useState<
    AlertInvocation | undefined
  >(undefined);

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
      Header: "Alert Channels",
      accessor: "alert",
      disableSortBy: true,
      Cell: (props) => AlertChannelCell(props.cell.value as Alert),
    },
    {
      Header: "Actions",
      accessor: "invocationObj",
      disableSortBy: true,
      Cell: (props) =>
        InvocationObjectCell({
          invocation: props.cell.value,
          onOpen,
          setInvocationToView,
        }),
    },
  ];

  return (
    <>
      <InvocationObjectModal
        invocation={invocationToView}
        isOpen={isOpen}
        onClose={onClose}
      />
      {CommonOverviewTable<RowProps>({
        data: {
          dependencies: [invocations ? invocations : []],
          dependenciesIsLoading: invocations === undefined,
          rowPropsGeneratorFunction: rowPropsGeneratorFunction,
        },
        columns: columns,
        itemType: "Alert Invocations",
        jsonDownLoad: (
          <JSONDownloadButton data={invocations} filename={"alerts.json"} />
        ),
      })}
    </>
  );
}
