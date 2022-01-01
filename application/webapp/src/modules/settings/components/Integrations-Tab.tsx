import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Alert,
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertIcon,
  Box,
  Button,
  chakra,
  Divider,
  Flex,
  Text,
  useColorModeValue,
  useToast,
} from "@chakra-ui/react";
import NextLink from "next/link";
import { useRouter } from "next/router";
import { SlackInstallation } from "project-types";
import React, { RefObject } from "react";
import { useSWRConfig } from "swr";
import { useAlerts } from "../../alerts/client";
import {
  testSlackInstallation,
  useSlackInstallUrl,
} from "../../integrations/slack/client";
import {
  deleteUserSlackInstallation,
  userSlackInstallationApiUrl,
  useUserSlackInstallation,
} from "../../user/client";

const SlackSvg = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    style={{ height: "16px", width: "16px", marginRight: "12px" }}
    viewBox="0 0 122.8 122.8"
  >
    <path
      d="M25.8 77.6c0 7.1-5.8 12.9-12.9 12.9S0 84.7 0 77.6s5.8-12.9 12.9-12.9h12.9v12.9zm6.5 0c0-7.1 5.8-12.9 12.9-12.9s12.9 5.8 12.9 12.9v32.3c0 7.1-5.8 12.9-12.9 12.9s-12.9-5.8-12.9-12.9V77.6z"
      fill="#e01e5a"
    ></path>
    <path
      d="M45.2 25.8c-7.1 0-12.9-5.8-12.9-12.9S38.1 0 45.2 0s12.9 5.8 12.9 12.9v12.9H45.2zm0 6.5c7.1 0 12.9 5.8 12.9 12.9s-5.8 12.9-12.9 12.9H12.9C5.8 58.1 0 52.3 0 45.2s5.8-12.9 12.9-12.9h32.3z"
      fill="#36c5f0"
    ></path>
    <path
      d="M97 45.2c0-7.1 5.8-12.9 12.9-12.9s12.9 5.8 12.9 12.9-5.8 12.9-12.9 12.9H97V45.2zm-6.5 0c0 7.1-5.8 12.9-12.9 12.9s-12.9-5.8-12.9-12.9V12.9C64.7 5.8 70.5 0 77.6 0s12.9 5.8 12.9 12.9v32.3z"
      fill="#2eb67d"
    ></path>
    <path
      d="M77.6 97c7.1 0 12.9 5.8 12.9 12.9s-5.8 12.9-12.9 12.9-12.9-5.8-12.9-12.9V97h12.9zm0-6.5c-7.1 0-12.9-5.8-12.9-12.9s5.8-12.9 12.9-12.9h32.3c7.1 0 12.9 5.8 12.9 12.9s-5.8 12.9-12.9 12.9H77.6z"
      fill="#ecb22e"
    ></path>
  </svg>
);

const UninstallSlackInstallationDialog = (props: {
  leastDestructiveRef: RefObject<any>;
  isOpen: boolean;
  onClick: () => void;
  onClose: () => void;
  workspace: string;
  channel: string;
}) => {
  const { leastDestructiveRef, isOpen, onClick, workspace, channel, onClose } =
    props;

  return (
    <AlertDialog
      leastDestructiveRef={leastDestructiveRef}
      isOpen={isOpen}
      onClose={onClose}
    >
      <AlertDialogContent shadow="xl" borderWidth="2px" borderColor="gray.100">
        <AlertDialogHeader fontSize="2xl" fontWeight="medium">
          Uninstall Slack
        </AlertDialogHeader>
        <AlertDialogBody>
          Are you sure you want to uninstall your slack installation on{" "}
          <b>{workspace}</b> workspace? This installation sends alerts to the{" "}
          <b>{channel}</b> channel.
          <chakra.hr my="1em" />
          Uninstalling Slack will{" "}
          <b>
            delete any Slack Alerts and detach these alerts from their monitors
          </b>
          . You will have to attach a new alert to the monitors.
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
            onClick={() => {
              onClick();
            }}
          >
            Uninstall Slack
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export const AddToSlackButton = (props: {
  url: string | undefined;
  hasIntegration: boolean;
  openUninstallDialog: () => void;
}) => {
  const { url, hasIntegration } = props;
  return !hasIntegration ? (
    <NextLink href={url ? url : ""} passHref>
      <Button
        as="a"
        style={{
          alignItems: "center",
          color: "#fff",
          backgroundColor: "#4A154B",
          border: 0,
          borderRadius: "4px",
          display: "inline-flex",
          fontFamily: "Lato, sans-serif",
          fontSize: "16px",
          fontWeight: 600,
          height: "40px",
          justifyContent: "center",
          textDecoration: "none",
          width: "160px",
          marginBottom: "1em",
        }}
      >
        {SlackSvg}
        {"Add to Slack"}
      </Button>
    </NextLink>
  ) : (
    <Button
      style={{
        alignItems: "center",
        color: "#fff",
        border: 0,
        borderRadius: "4px",
        display: "inline-flex",
        fontFamily: "Lato, sans-serif",
        fontSize: "16px",
        fontWeight: 600,
        height: "40px",
        justifyContent: "center",
        width: "200px",
        marginBottom: "1em",
      }}
      bg="#4A154B"
      _hover={{
        bg: "red.600",
      }}
      onClick={props.openUninstallDialog}
    >
      {SlackSvg}
      Uninstall Slack
    </Button>
  );
};

export const SlackInstallationInfo = (props: {
  installation: SlackInstallation;
}) => {
  const { installation } = props;
  const { alerts, isLoading: alertsIsLoading, isError } = useAlerts();

  const slackAlerts = alerts
    ? alerts.filter((alert) => alert.type === "Slack")
    : [];

  return (
    <Accordion allowToggle>
      <AccordionItem outline="none" border="none">
        <AccordionButton pl="0">
          <AccordionIcon />
          <Box textAlign="left" fontSize="lg">
            Slack Installation Details
          </Box>
        </AccordionButton>
        <AccordionPanel pb={4} pl="0">
          <chakra.p>
            Workspace Name: &nbsp;
            <chakra.span
              fontWeight="bold"
              px="10px"
              borderRadius="sm"
              fontSize="lg"
              py="2px"
            >
              {installation.team?.name}
            </chakra.span>
          </chakra.p>
          <chakra.p mt="1em">
            Channel Name: &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            <chakra.span
              fontWeight="bold"
              px="10px"
              borderRadius="sm"
              fontSize="lg"
              py="2px"
            >
              {installation.incomingWebhook?.channel}
            </chakra.span>
          </chakra.p>
          <Button
            mt="1em"
            rounded="4px"
            fontSize="lg"
            fontWeight="medium"
            px="1em"
            shadow="sm"
            colorScheme="blue"
            bgColor="gray.500"
            color="white"
            _hover={{
              bg: "gray.600",
            }}
            onClick={async () => {
              await testSlackInstallation();
            }}
          >
            Test Installation
          </Button>
        </AccordionPanel>
      </AccordionItem>
      {!alertsIsLoading && slackAlerts.length > 0 && (
        <AccordionItem outline="none" border="none">
          <AccordionButton>
            <AccordionIcon />
            <Box textAlign="left" fontSize="lg">
              Slack Alerts ({slackAlerts.length} total)
            </Box>
          </AccordionButton>
          <AccordionPanel pb={4}>
            {slackAlerts.map((alert) => (
              <Flex key={alert.alert_id} flexDir="row">
                <chakra.p>{alert.name}</chakra.p>
                <chakra.p ml="2em">Severity Level: {alert.severity}</chakra.p>
              </Flex>
            ))}
          </AccordionPanel>
        </AccordionItem>
      )}
    </Accordion>
  );
};

export function IntegrationsTab() {
  const { url, isError, isLoading } = useSlackInstallUrl();
  const router = useRouter();
  const [isOpen, setIsOpen] = React.useState<boolean>(false);
  const {
    data: slackInstallation,
    isLoading: slackInstallationIsLoading,
    isError: slackInstallationIsError,
    mutate: slackMutate,
  } = useUserSlackInstallation();
  const { cache } = useSWRConfig();
  const { slackIntegrationSuccess, slackIntegrationCanceled } = router.query;

  const cancelRef = React.useRef(true);
  const [uninstallSlackDialogOpen, setUninstallSlackDialogOpen] =
    React.useState(false);

  const toast = useToast();
  const postToast = (
    title: string,
    message: string,
    status: "info" | "warning" | "success" | "error"
  ) => {
    setIsOpen(true);
    toast({
      title: title,
      description: message,
      status: status,
      duration: 9000,
      isClosable: true,
      variant: "solid",
      position: "top",
    });
  };

  const uninstallSlack = async () => {
    const uninstalled = await deleteUserSlackInstallation(postToast, postToast);
    if (uninstalled) {
      await slackMutate();
      cache.delete(userSlackInstallationApiUrl); // needed for some reason in order to refresh, idk
    }
    setUninstallSlackDialogOpen(false);
  };

  return (
    <Box
      bg={useColorModeValue("white", "#0f131a")}
      rounded="md"
      shadow="md"
      pt="20px"
      pb="20px"
      px="20px"
    >
      {slackInstallation &&
        UninstallSlackInstallationDialog({
          leastDestructiveRef: cancelRef,
          isOpen: uninstallSlackDialogOpen,
          onClick: uninstallSlack,
          workspace: slackInstallation.team?.name ?? "",
          channel: slackInstallation.incomingWebhook?.channel ?? "",
          onClose: () => {
            setUninstallSlackDialogOpen(false);
          },
        })}
      <Text fontSize="lg" color="gray.500" mb=".7em">
        Slack:
      </Text>
      {slackIntegrationSuccess === "true" && slackInstallation !== undefined && (
        <Alert
          status="success"
          variant="subtle"
          borderRadius="lg"
          mb="1.2em"
          maxW="fit-content"
        >
          <AlertIcon />
          Slack integration successful! You can now create Slack alerts!
        </Alert>
      )}
      {slackIntegrationSuccess === "false" && (
        <Alert
          status="error"
          variant="subtle"
          borderRadius="lg"
          mb="1.2em"
          maxW="fit-content"
        >
          <AlertIcon />
          Slack integration failed. Please try again later or contact us for
          assistance.
        </Alert>
      )}
      {slackIntegrationCanceled === "true" && (
        <Alert
          status="error"
          variant="subtle"
          borderRadius="lg"
          mb="1.2em"
          maxW="fit-content"
        >
          <AlertIcon />
          Slack integration canceled.
        </Alert>
      )}
      {!isLoading && !slackInstallationIsLoading && (
        <AddToSlackButton
          url={url ? url.url : ""}
          hasIntegration={
            !slackInstallationIsLoading && slackInstallation !== undefined
          }
          openUninstallDialog={() => {
            setUninstallSlackDialogOpen(true);
          }}
        />
      )}
      {!slackInstallationIsLoading && slackInstallation !== undefined && (
        <SlackInstallationInfo installation={slackInstallation} />
      )}
      <Divider mb="1em" />
    </Box>
  );
}
