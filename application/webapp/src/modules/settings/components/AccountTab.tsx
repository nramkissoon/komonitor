import { Button, Divider, Text, useToast } from "@chakra-ui/react";
import React from "react";
import { ColorModeToggle } from "./ColorModeToggle";
import {
  DeleteAccountDialog,
  useDeleteAccountDialog,
} from "./Delete-User-Dialog";

export function AccountTab() {
  const errorToast = useToast();
  const postErrorToast = (message: string) =>
    errorToast({
      title: "Unable to delete account.",
      description: message,
      status: "error",
      duration: 9000,
      isClosable: true,
      variant: "solid",
      position: "top",
    });

  const { cancelRef, isOpen, onClose, onOpen } = useDeleteAccountDialog();

  return (
    <>
      <DeleteAccountDialog
        isOpen={isOpen}
        onClose={onClose}
        leastDestructiveRef={cancelRef}
        onError={postErrorToast}
      />
      <Text fontSize="lg" color="gray.500" mb=".7em">
        Appearance:
      </Text>
      <ColorModeToggle />
      <Divider mb="1em" />
      <Text fontSize="lg" color="gray.500" mb=".7em">
        Delete your account permanently:
      </Text>
      <Button
        colorScheme="red"
        color="white"
        bgColor="red.500"
        fontWeight="normal"
        onClick={onOpen}
        shadow="sm"
        _hover={{
          bg: "red.600",
        }}
      >
        Delete Account
      </Button>
    </>
  );
}
