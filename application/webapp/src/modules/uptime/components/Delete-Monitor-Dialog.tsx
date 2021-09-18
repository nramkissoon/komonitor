import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  Button,
  chakra,
} from "@chakra-ui/react";
import React, { RefObject } from "react";

interface DeleteMonitorDialogProps {
  isOpen: boolean;
  monitorId: string;
  name: string;
  onClose: () => void;
  leastDestructiveRef: RefObject<any>;
}

export function MonitorDeleteDialog(props: DeleteMonitorDialogProps) {
  const { isOpen, monitorId, name, onClose, leastDestructiveRef } = props;
  return (
    <AlertDialog
      leastDestructiveRef={leastDestructiveRef}
      isOpen={isOpen}
      onClose={onClose}
    >
      <AlertDialogContent>
        <AlertDialogHeader fontSize="2xl" fontWeight="normal">
          Delete Uptime Monitor
        </AlertDialogHeader>
        <AlertDialogBody>
          Are you sure?{" "}
          <chakra.span color="red.500" fontSize="lg" fontWeight="semibold">
            {name}
          </chakra.span>{" "}
          monitor will be deleted. You can't undo this action afterwards.
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
          >
            Delete
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
