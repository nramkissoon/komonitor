import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  Button,
  chakra,
  Input,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import { signOut } from "next-auth/client";
import React, { RefObject } from "react";
import { deleteUser } from "../../user/client";

export function useDeleteAccountDialog() {
  const cancelRef = React.useRef(true);
  const { isOpen, onOpen, onClose } = useDisclosure();

  return {
    cancelRef,
    isOpen,
    onClose,
    onOpen,
  };
}

interface DeleteAccountDialogProps {
  isOpen: boolean;
  onClose: () => void;
  leastDestructiveRef: RefObject<any>;
  onError: (message: string) => void;
}

export function DeleteAccountDialog(props: DeleteAccountDialogProps) {
  const { isOpen, onClose, leastDestructiveRef, onError } = props;
  const [inputVal, setInputVal] = React.useState("");
  const [inputIsError, setInputIsError] = React.useState("");
  const handleInputChange = (event: {
    target: { value: React.SetStateAction<string> };
  }) => setInputVal(event.target.value);

  const handleOnSubmit = async () => {
    if (inputVal && inputVal !== "delete") {
      setInputIsError("Enter 'delete' in the input above to delete account.");
      return;
    } else if (inputVal === "delete") {
      const deleted = await deleteUser(onError);
      if (deleted) signOut({ callbackUrl: "/" });
      onClose();
    }
  };

  const resetOnClose = () => {
    setInputVal("");
    setInputIsError("");
    onClose();
  };

  return (
    <AlertDialog
      leastDestructiveRef={leastDestructiveRef}
      isOpen={isOpen}
      onClose={resetOnClose}
      size="2xl"
    >
      <AlertDialogContent>
        <AlertDialogHeader fontSize="2xl" fontWeight="normal">
          Delete Account
        </AlertDialogHeader>
        <AlertDialogBody>
          <Text mb="1em">
            Are you sure? Your account and associated monitors/alerts will be{" "}
            <chakra.span color="red.500" fontSize="lg" fontWeight="semibold">
              permanently
            </chakra.span>{" "}
            deleted. You cannot undo this action afterwards.
          </Text>
          <Text>
            Enter{" "}
            <chakra.span color="red.500" fontSize="lg">
              delete
            </chakra.span>{" "}
            below to confirm:
          </Text>
          <Input
            value={inputVal}
            onChange={handleInputChange}
            placeholder="delete"
            mb="1"
            shadow="sm"
          />
          <Text color="red.500">{inputIsError}</Text>
        </AlertDialogBody>
        <AlertDialogFooter>
          <Button
            ref={leastDestructiveRef}
            onClick={resetOnClose}
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
            onClick={handleOnSubmit}
          >
            Delete
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
