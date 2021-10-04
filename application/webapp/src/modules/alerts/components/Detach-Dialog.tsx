import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
} from "@chakra-ui/modal";
import { Button } from "@chakra-ui/react";
import React, { RefObject } from "react";

export function useDetachDialog() {
  let [itemToDetach, setItemToDetach] = React.useState(undefined as any);
  const onCloseDetachDialog = () => setItemToDetach(undefined as any);
  const cancelRef = React.useRef(true);
  const openDetachDialog = (item: any) => setItemToDetach(item);
  return {
    itemToDetach,
    setItemToDetach,
    onCloseDetachDialog,
    cancelRef,
    openDetachDialog,
  };
}

interface DetachDialogProps {
  isOpen: boolean;
  item: any;
  alertId: string;
  onClose: () => void;
  leastDestructiveRef: RefObject<any>;
  detachApiFunc:
    | ((
        item: any,
        alertId: string,
        onError?: (message: string) => void
      ) => Promise<void>)
    | null;
  onError?: (message: string) => void;
}

export function DetachDialog(props: DetachDialogProps) {
  const {
    isOpen,
    item,
    alertId,
    onClose,
    leastDestructiveRef,
    detachApiFunc,
    onError,
  } = props;

  return (
    <AlertDialog
      leastDestructiveRef={leastDestructiveRef}
      isOpen={isOpen}
      onClose={onClose}
    >
      <AlertDialogContent>
        <AlertDialogHeader fontSize="2xl" fontWeight="normal">
          Detach Alert from Monitor
        </AlertDialogHeader>
        <AlertDialogBody>
          Are you sure? You can always undo this action by editing the monitor.
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
              if (detachApiFunc !== null)
                await detachApiFunc(item, alertId, onError);
              else {
                // TODO log
              }
              onClose();
            }}
          >
            Detach
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
