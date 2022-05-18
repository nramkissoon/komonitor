import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Button,
  chakra,
  useColorModeValue,
  useToast,
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import { RefObject } from "react";
import { deleteDiscordIntegration } from "../discord/client";
import { deleteSlackIntegration } from "../slack/client";

export interface RemoveSlackInstallationDialogProps {
  leastDestructiveRef: RefObject<any>;
  isOpen: boolean;
  onClose: () => void;
  workspace: string;
  channel: string;
  mutate: () => void;
  channelId: string;
  teamId: string;
}

export const RemoveSlackInstallationDialog = (
  props: RemoveSlackInstallationDialogProps
) => {
  const {
    leastDestructiveRef,
    isOpen,
    workspace,
    channel,
    onClose,
    channelId,
    teamId,
    mutate,
  } = props;

  const { teamId: komonitorTeamId } = useRouter().query;

  const toast = useToast();
  const postErrorToast = (message: string) => {
    toast({
      title: "Unable to remove integration",
      description: message,
      status: "error",
      duration: 9000,
      isClosable: true,
      variant: "solid",
      position: "top",
    });
  };

  return (
    <AlertDialog
      leastDestructiveRef={leastDestructiveRef}
      isOpen={isOpen}
      onClose={onClose}
    >
      <AlertDialogOverlay />
      <AlertDialogContent
        shadow="xl"
        borderWidth="1px"
        borderColor="red.300"
        bg={useColorModeValue("white", "gray.900")}
      >
        <AlertDialogHeader fontSize="2xl" fontWeight="medium">
          Remove Slack Integration
        </AlertDialogHeader>
        <AlertDialogBody fontSize="lg" fontWeight="normal">
          Are you sure you want to remove your integration on{" "}
          <chakra.b color="blue.400">{workspace}</chakra.b> workspace? This
          integration sends alerts to the{" "}
          <chakra.b color="blue.400">{channel}</chakra.b> channel.
          <chakra.hr my="1em" />
          Removing Slack will{" "}
          <chakra.b color="red.500">
            delete any corresponding Slack Alerts from all monitors. If Slack is
            the only alert channel for a monitor, the monitor will have no
            alerts.
          </chakra.b>{" "}
          You will have to create a new alert for the monitor.
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
              const removed = await deleteSlackIntegration({
                slackChannel: channelId,
                slackTeam: teamId,
                onError: postErrorToast,
                onSuccess: () => {
                  mutate();
                  onClose();
                },
                teamId: komonitorTeamId as string,
              });

              if (removed) {
                toast({
                  title: "Successfully removed integration",
                  description: "Slack integration removal completed.",
                  status: "success",
                  duration: 9000,
                  isClosable: true,
                  variant: "solid",
                  position: "top",
                });
              }
            }}
          >
            Remove Slack
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export interface RemoveDiscordDialogProps {
  leastDestructiveRef: RefObject<any>;
  isOpen: boolean;
  onClose: () => void;
  mutate: () => void;
  channelId: string;
  guildId: string;
  channelName: string;
  guildName: string;
}

export const RemoveDiscordDialog = ({
  leastDestructiveRef,
  isOpen,
  onClose,
  mutate,
  channelId,
  channelName,
  guildId,
  guildName,
}: RemoveDiscordDialogProps) => {
  const { teamId } = useRouter().query;
  const toast = useToast();
  const postErrorToast = (message: string) => {
    toast({
      title: "Unable to remove integration",
      description: message,
      status: "error",
      duration: 9000,
      isClosable: true,
      variant: "solid",
      position: "top",
    });
  };
  return (
    <AlertDialog
      leastDestructiveRef={leastDestructiveRef}
      isOpen={isOpen}
      onClose={onClose}
    >
      <AlertDialogOverlay />
      <AlertDialogContent
        shadow="xl"
        borderWidth="1px"
        borderColor="red.300"
        bg={useColorModeValue("white", "gray.900")}
      >
        <AlertDialogHeader fontSize="2xl" fontWeight="medium">
          Remove Discord Integration
        </AlertDialogHeader>
        <AlertDialogBody fontSize="lg" fontWeight="normal">
          Are you sure you want to remove your integration on{" "}
          <chakra.b color="blue.400">{guildName}</chakra.b> server? This
          integration sends alerts to the{" "}
          <chakra.b color="blue.400">{channelName}</chakra.b> channel.
          <chakra.hr my="1em" />
          Removing Discord will{" "}
          <chakra.b color="red.500">
            delete any corresponding Discord Alerts from all monitors. If
            Discord is the only alert channel for a monitor, the monitor will
            have no alerts.
          </chakra.b>{" "}
          You will have to create a new alert for the monitor.
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
              const removed = await deleteDiscordIntegration({
                guildId,
                channelId,
                teamId: teamId as string,
                onError: postErrorToast,
                onSuccess: () => {
                  mutate();
                  onClose();
                },
              });

              if (removed) {
                toast({
                  title: "Successfully removed integration",
                  description: "Slack integration removal completed.",
                  status: "success",
                  duration: 9000,
                  isClosable: true,
                  variant: "solid",
                  position: "top",
                });
              }
            }}
          >
            Remove Discord
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
