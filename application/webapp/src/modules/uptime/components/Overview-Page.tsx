import {
  Box,
  Divider,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  useColorModeValue,
  useDisclosure,
} from "@chakra-ui/react";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import React from "react";
import {
  AlertInvocation,
  toExternalUptimeMonitorObject,
  UptimeMonitor,
} from "utils";
import { regionToLocationStringMap } from "../../../common/client-utils";
import {
  DeleteDialog,
  useDeleteDialog,
} from "../../../common/components/Delete-Dialog";
import { useTeam } from "../../../common/components/TeamProvider";
import { useAlertInvocationsAllTime } from "../../alerts/client";
import { InvocationTable } from "../../alerts/components/Invocation-Table";
import { PLAN_PRODUCT_IDS } from "../../billing/plans";
import {
  useUserServicePlanProductId,
  useUserTimezoneAndOffset,
} from "../../user/client";
import { deleteMonitor, useMonitorStatusHistory } from "../client";
import { yesterday } from "../utils";
import { CreateUpdateFormRewrite } from "./Create-Update-Form-Rewrite";
import { OverviewPageDataCards } from "./Overview-Page-Data-Cards";
import { OverviewPageGraphProps } from "./Overview-Page-Graph";
import { OverviewPageHeader } from "./Overview-Page-Header";
import { SelectStatusHistoryRadioButtons } from "./SelectStatusHistoryRadioButtons";
const OverviewPageGraph = dynamic<OverviewPageGraphProps>(() =>
  import("./Overview-Page-Graph").then((module) => module.OverviewPageGraph)
);
const StatusTable = dynamic(() => import("./Status-Table"));

const EditFormModal = ({
  monitor,
  productId,
  isOpen,
  onClose,
}: {
  monitor: UptimeMonitor;
  productId: string;
  isOpen: boolean;
  onClose: () => void;
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent maxW="6xl" bg={useColorModeValue("gray.50", "gray.900")}>
        <ModalHeader mb="-10px">Edit Uptime Monitor</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <CreateUpdateFormRewrite
            product_id={productId}
            closeForm={onClose}
            currentMonitorAttributes={monitor}
          />
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

interface OverviewPageProps {
  monitor: UptimeMonitor;
  mutate: () => void;
}

export function OverviewPage(props: OverviewPageProps) {
  // string because the radio select component is a bitch
  const [monitorStatusSince, setMonitorStatusSince] = React.useState<string>(
    yesterday.toString()
  );
  console.log(toExternalUptimeMonitorObject(props.monitor));
  const { isOpen: isEditFormOpen, onOpen, onClose } = useDisclosure();

  const {
    data,
    isLoading: productIdIsLoading,
    isError: productIdIsError,
  } = useUserServicePlanProductId();

  const {
    data: tzAndOffset,
    isLoading: tzPrefIsLoading,
    isError: tzPrefIsError,
  } = useUserTimezoneAndOffset();

  const { monitor } = props;
  const { name, url, monitor_id, region, alert } = monitor;

  const router = useRouter();
  const { team } = useTeam();
  const { projectId } = router.query;

  const {
    statuses,
    isError: statusesIsError,
    isLoading: statusesIsLoading,
  } = useMonitorStatusHistory(
    monitor_id as string,
    Number.parseInt(monitorStatusSince)
  );

  const mostRecentStatus = React.useMemo(() => {
    return statuses && statuses[monitor_id].length > 0
      ? statuses[monitor_id]?.reduce((prev, current) => {
          return prev.timestamp > current.timestamp ? prev : current;
        })
      : null;
  }, [statuses]);

  // get the invocations for the relevant alerts
  const {
    invocations,
    isError: invocationsIsError,
    isLoading: invocationsIsLoading,
  } = useAlertInvocationsAllTime([monitor_id]);

  // filter out the invocations not related to this specific monitor
  let invocationsForMonitor: { [alertId: string]: AlertInvocation[] } = {};
  for (let id of Object.keys(invocations ?? {})) {
    let filteredInvocations: AlertInvocation[] = invocations[id].filter(
      (invocation) => invocation.monitor_id === monitor_id
    );
    invocationsForMonitor[id] = filteredInvocations;
  }

  // Setup for delete dialog
  let {
    mutate,
    deleteItem,
    setDeleteItem,
    onCloseDeleteDialog,
    openDeleteDialog,
    cancelRef,
  } = useDeleteDialog();

  return (
    <Box>
      <DeleteDialog
        isOpen={deleteItem.id !== undefined}
        itemName={deleteItem.name}
        itemId={deleteItem.id}
        onClose={onCloseDeleteDialog}
        leastDestructiveRef={cancelRef}
        mutate={mutate}
        mutateApiUrl="/api/uptime/monitors"
        deleteApiFunc={deleteMonitor}
        itemType="monitor"
        onSuccess={() =>
          router.push(
            ((`/${team ? team : "app"}/projects/` + projectId) as string) +
              "/uptime"
          )
        }
      />
      <EditFormModal
        isOpen={isEditFormOpen}
        onClose={onClose}
        monitor={monitor}
        productId={data ? data.productId : ""}
      />
      <OverviewPageHeader
        monitor={monitor}
        mutate={mutate}
        monitorName={name}
        monitorUrl={url}
        currentStatus={mostRecentStatus?.status as string}
        lastChecked={mostRecentStatus?.timestamp}
        monitorId={monitor_id}
        monitorRegion={regionToLocationStringMap[region]}
        openDeleteDialog={openDeleteDialog}
        openEditForm={onOpen}
      />
      <Divider mb="1em" />
      <SelectStatusHistoryRadioButtons
        setValue={setMonitorStatusSince}
        value={Number.parseInt(monitorStatusSince)}
        productId={
          productIdIsError || productIdIsLoading
            ? PLAN_PRODUCT_IDS.FREE
            : (data.productId as string)
        }
      />
      <Tabs>
        <TabList mb="1em">
          <Tab>Overview</Tab>
          <Tab>Statuses</Tab>
          <Tab>Alerts</Tab>
        </TabList>
        <TabPanels>
          <TabPanel p="0">
            <OverviewPageDataCards
              monitorId={monitor_id}
              statuses={statuses ? statuses[monitor_id] : undefined}
              since={Number.parseInt(monitorStatusSince)}
            />
            <OverviewPageGraph
              monitorId={monitor_id}
              statuses={statuses ? statuses[monitor_id] : undefined}
              since={Number.parseInt(monitorStatusSince)}
              tzOffset={tzAndOffset?.offset ?? 0}
            />
          </TabPanel>
          <TabPanel p="0">
            <StatusTable
              monitorId={monitor_id}
              statuses={statuses ? statuses[monitor_id] : undefined}
              offset={tzAndOffset?.offset ?? 0}
            />
          </TabPanel>
          <TabPanel p="0">
            <InvocationTable
              invocations={invocations ? invocations[monitor_id] : []}
            />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Box>
  );
}
//8======D
