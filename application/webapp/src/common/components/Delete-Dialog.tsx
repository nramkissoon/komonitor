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
import { useSWRConfig } from "swr";

export function useDeleteDialog() {
  const { mutate } = useSWRConfig();
  let [deleteItem, setDeleteItem] = React.useState({} as any);
  const onCloseDeleteDialog = () => setDeleteItem({} as any);
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

interface DeleteDialogProps {
  isOpen: boolean;
  itemName: string;
  itemId: string;
  onClose: () => void;
  leastDestructiveRef: RefObject<any>;
  mutate: any;
  mutateApiUrl: string;
  deleteApiFunc: any;
  itemType: string;
}

export function DeleteDialog(props: DeleteDialogProps) {
  const {
    isOpen,
    itemId,
    itemName,
    leastDestructiveRef,
    mutate,
    onClose,
    mutateApiUrl,
    deleteApiFunc,
    itemType,
  } = props;

  return (
    <AlertDialog
      leastDestructiveRef={leastDestructiveRef}
      isOpen={isOpen}
      onClose={onClose}
    >
      <AlertDialogContent>
        <AlertDialogHeader fontSize="2xl" fontWeight="normal">
          Delete {itemType.charAt(0).toUpperCase() + itemType.slice(1)}
        </AlertDialogHeader>
        <AlertDialogBody>
          Are you sure?{" "}
          <chakra.span color="red.500" fontSize="lg" fontWeight="semibold">
            {itemName}
          </chakra.span>{" "}
          {itemType} will be deleted. You can't undo this action afterwards.
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
              const deleted = await deleteApiFunc(itemId);
              if (deleted) mutate(mutateApiUrl);
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
