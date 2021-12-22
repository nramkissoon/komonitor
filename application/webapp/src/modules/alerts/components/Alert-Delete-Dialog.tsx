import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  Button,
  chakra,
} from "@chakra-ui/react";
import { UptimeMonitor } from "project-types";
import React, { RefObject } from "react";
import { useSWRConfig } from "swr";
import { alertApiUrl, deleteAlert } from "../client";

export function useDeleteDialog() {
  const { mutate } = useSWRConfig();
  let [deleteItem, setDeleteItem] = React.useState(
    {} as { name: string; id: string }
  );
  const onCloseDeleteDialog = () =>
    setDeleteItem({} as { name: string; id: string });
  const cancelRef = React.useRef(true);
  const openDeleteDialog = (item: { name: string; id: string }) =>
    setDeleteItem(item);
  return {
    mutate,
    deleteItem,
    setDeleteItem,
    onCloseDeleteDialog,
    cancelRef,
    openDeleteDialog,
  };
}

export interface DeleteDialogProps {
  isOpen: boolean;
  itemName: string;
  itemId: string;
  onClose: () => void;
  leastDestructiveRef: RefObject<any>;
  mutate: any;
  attachedMonitors: UptimeMonitor[];
  onSuccess?: () => void;
  onError?: (msg: string) => void;
}

export function AlertDeleteDialog(props: DeleteDialogProps) {
  const {
    isOpen,
    itemId,
    itemName,
    leastDestructiveRef,
    mutate,
    onClose,
    onSuccess,
    onError,
    attachedMonitors,
  } = props;

  return (
    <AlertDialog
      leastDestructiveRef={leastDestructiveRef}
      isOpen={isOpen}
      onClose={onClose}
    >
      <AlertDialogContent shadow="xl" borderWidth="2px" borderColor="gray.100">
        <AlertDialogHeader fontSize="2xl" fontWeight="normal">
          Delete Alert
        </AlertDialogHeader>
        <AlertDialogBody>
          <chakra.span color="red.500" fontSize="lg" fontWeight="semibold">
            {itemName}
          </chakra.span>{" "}
          alert will be deleted. You can't undo this action afterwards.{" "}
          {attachedMonitors.length > 0 && (
            <chakra.p>
              This alert is attached to {attachedMonitors.length} monitor(s).
              Deleting the alert will detach it from <b>all</b> monitors,
              leaving those monitors without an alert. Are you sure you want to
              delete?
            </chakra.p>
          )}
        </AlertDialogBody>
        <AlertDialogFooter>
          <Button
            ref={leastDestructiveRef}
            onClick={onClose}
            mr="1.5em"
            fontWeight="normal"
          >
            Cancel
          </Button>
          <Button
            colorScheme="red"
            color="white"
            bgColor="red.500"
            fontWeight="normal"
            onClick={async () => {
              const deleted = await deleteAlert(itemId, onSuccess, onError);
              if (deleted) mutate(alertApiUrl);
              onClose();
            }}
          >
            Delete
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
