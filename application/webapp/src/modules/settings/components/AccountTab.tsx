import {
  Box,
  Button,
  Divider,
  Text,
  useColorModeValue,
  useToast,
} from "@chakra-ui/react";
import React from "react";
import { useUserTimezoneAndOffset } from "../../user/client";
import { ColorModeToggle } from "./ColorModeToggle";
import {
  DeleteAccountDialog,
  useDeleteAccountDialog,
} from "./Delete-User-Dialog";
import { TimezoneSelector } from "./Timezone-Selector";

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

  const {
    data: tzAndOffset,
    isLoading: tzPrefIsLoading,
    isError: tzPrefIsError,
    mutate: tzMutate,
  } = useUserTimezoneAndOffset();

  const { cancelRef, isOpen, onClose, onOpen } = useDeleteAccountDialog();

  return (
    <>
      <DeleteAccountDialog
        isOpen={isOpen}
        onClose={onClose}
        leastDestructiveRef={cancelRef}
        onError={postErrorToast}
      />
      <Box
        bg={useColorModeValue("white", "#0f131a")}
        rounded="md"
        shadow="md"
        pt="20px"
        pb="10px"
        px="20px"
      >
        <Text fontSize="lg" color="gray.500" mb=".7em">
          Appearance:
        </Text>
        <ColorModeToggle />
        <Divider mb="1em" />
        <Text fontSize="lg" color="gray.500" mb=".7em">
          Timezone Preference:
        </Text>
        {!tzPrefIsLoading && (
          <TimezoneSelector
            initialTz={tzAndOffset?.tz ?? "Etc/GMT"}
            mutate={tzMutate}
          />
        )}
      </Box>
      <Box
        bg={useColorModeValue("white", "#0f131a")}
        rounded="md"
        shadow="md"
        pb="20px"
        px="20px"
        pt="20px"
        mt="1em"
      >
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
      </Box>
    </>
  );
}
