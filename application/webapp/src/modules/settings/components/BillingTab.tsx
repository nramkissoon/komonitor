import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  Badge,
  Box,
  Button,
  chakra,
  Divider,
  Input,
  Text,
  useColorModeValue,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import router, { useRouter } from "next/router";
import React, { RefObject } from "react";
import { getDisplayStringFromPlanProductId } from "../../../common/utils";
import {
  createAndRedirectToCustomerPortal,
  deleteTeam,
  useProductId,
} from "../client";

function useDeleteTeamDialog() {
  const cancelRef = React.useRef(true);
  const { isOpen, onOpen, onClose } = useDisclosure();

  return {
    cancelRef,
    isOpen,
    onClose,
    onOpen,
  };
}

interface DeleteTeamDialogProps {
  teamId: string;
  isOpen: boolean;
  onClose: () => void;
  leastDestructiveRef: RefObject<any>;
  onError: (message: string) => void;
}

function DeleteTeamDialog(props: DeleteTeamDialogProps) {
  const { isOpen, onClose, leastDestructiveRef, onError, teamId } = props;
  const [inputVal, setInputVal] = React.useState("");
  const [inputIsError, setInputIsError] = React.useState("");
  const handleInputChange = (event: {
    target: { value: React.SetStateAction<string> };
  }) => setInputVal(event.target.value);

  const handleOnSubmit = async () => {
    if (inputVal && inputVal !== "delete") {
      setInputIsError(
        "Enter 'delete' in the input above to cancel subscription and delete team."
      );
      return;
    } else if (inputVal === "delete") {
      const deleted = await deleteTeam(teamId, onError);
      if (deleted) {
        router.push("/app?teamDeleted=true");
      }
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
          Delete Team
        </AlertDialogHeader>
        <AlertDialogBody>
          <Text mb="1em">
            Are you sure? Your team and associated projects/monitors will be{" "}
            <chakra.span color="red.500" fontSize="lg" fontWeight="semibold">
              permanently
            </chakra.span>{" "}
            deleted. You cannot undo this action afterwards.
          </Text>
          <Text mb="1em">
            Note: This will cancel your subscription plan as well.
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

export function BillingTab() {
  const { teamId } = useRouter().query;
  const { productId, productIdIsLoading } = useProductId(teamId as string);
  const errorToast = useToast();
  const postErrorToast = (message: string) =>
    errorToast({
      title: "Unable to perform action",
      description: message,
      status: "error",
      duration: 9000,
      isClosable: true,
      variant: "solid",
      position: "top",
    });
  const { cancelRef, isOpen, onClose, onOpen } = useDeleteTeamDialog();

  return (
    <>
      <DeleteTeamDialog
        teamId={teamId as string}
        leastDestructiveRef={cancelRef}
        isOpen={isOpen}
        onClose={onClose}
        onError={postErrorToast}
      />
      <Box
        bg={useColorModeValue("white", "gray.950")}
        rounded="md"
        shadow="md"
        pt="20px"
        pb="20px"
        px="20px"
      >
        <Text fontSize="lg" color="gray.500" mb=".7em">
          Current subscription plan:
        </Text>
        <Badge
          mb="1.2em"
          colorScheme="gray"
          fontSize="md"
          fontWeight="normal"
          py=".3em"
          px=".5em"
          borderRadius="lg"
          variant="subtle"
        >
          {getDisplayStringFromPlanProductId(
            productId ? productId : "Loading..."
          )}
        </Badge>
        <Divider mb="1em" />
        <Text fontSize="lg" color="gray.500" mb=".7em">
          Update your subscription and payment methods:
        </Text>
        <Button
          fontWeight="normal"
          colorScheme="blue"
          color="white"
          bgColor="blue.500"
          shadow="sm"
          onClick={() => createAndRedirectToCustomerPortal(teamId as string)}
          _hover={{
            bg: "blue.600",
          }}
        >
          Manage Subscription
        </Button>
      </Box>
      <Box
        bg={useColorModeValue("white", "gray.950")}
        rounded="md"
        shadow="md"
        pt="20px"
        pb="20px"
        px="20px"
        mt="20px"
      >
        <Text
          fontSize="lg"
          color={useColorModeValue("red.500", "red.400")}
          mb=".7em"
        >
          Danger Zone:
        </Text>

        <Button
          fontWeight="normal"
          colorScheme="red"
          color="white"
          bgColor="red.500"
          shadow="sm"
          onClick={() => {
            onOpen();
          }}
          _hover={{
            bg: "red.600",
          }}
        >
          Delete Team
        </Button>
      </Box>
    </>
  );
}
