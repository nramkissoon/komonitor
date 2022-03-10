import {
  Box,
  Button,
  Center,
  chakra,
  Flex,
  useColorModeValue,
  useDisclosure,
} from "@chakra-ui/react";
import dynamic from "next/dynamic";
import React from "react";
import { SlackInstallation } from "utils";
import { v4 as uuidv4 } from "uuid";
import { LoadingSpinner } from "../../../common/components/Loading-Spinner";
import { Integrations } from "../../user/client";
import { testSlackInstallation } from "../slack/client";
import { SlackSvg } from "./Icons";
import { RemoveSlackInstallationDialogProps } from "./RemoveDialogs";

const RemoveSlackInstallationDialog =
  dynamic<RemoveSlackInstallationDialogProps>(() =>
    import("./RemoveDialogs").then((mod) => mod.RemoveSlackInstallationDialog)
  );

const RemoveIntegrationButton = ({ onClick }: { onClick: () => void }) => {
  return (
    <Button
      rounded="full"
      colorScheme="red"
      color="red.500"
      variant="ghost"
      onClick={onClick}
    >
      Remove
    </Button>
  );
};

const TestIntegrationButton = ({
  onClick,
}: {
  onClick: () => Promise<void>;
}) => {
  const [isLoading, setIsLoading] = React.useState(false);
  return (
    <Button
      rounded="full"
      isLoading={isLoading}
      loadingText={"Testing..."}
      colorScheme="blue"
      color="blue.500"
      variant="ghost"
      onClick={async () => {
        setIsLoading(true);
        await onClick();
        setIsLoading(false);
      }}
    >
      Test
    </Button>
  );
};

const SlackInstallationInfoBar = ({
  installation,
  mutate,
}: {
  installation: SlackInstallation;
  mutate: () => void;
}) => {
  const { onOpen, onClose, isOpen } = useDisclosure();
  const cancelRef = React.useRef(true);
  return (
    <>
      {isOpen && (
        <RemoveSlackInstallationDialog
          leastDestructiveRef={cancelRef}
          isOpen={isOpen}
          onClose={onClose}
          workspace={installation.team?.name ?? ""}
          channel={installation.incomingWebhook?.channel ?? ""}
          mutate={mutate}
          channelId={installation.incomingWebhook?.channelId ?? ""}
          teamId={installation.team?.id ?? ""}
        />
      )}
      <Box marginLeft={[0, "20px"]}>{SlackSvg}</Box>
      <Flex
        mx="20px"
        alignItems="center"
        justifyContent="space-between"
        w="full"
        flexDir={["column", "row"]}
      >
        <Box my={["10px", "inherit"]}>
          You can receive alerts in the{" "}
          <chakra.span color="blue.400">
            {installation?.incomingWebhook?.channel ?? ""}
          </chakra.span>{" "}
          Slack channel in the{" "}
          <chakra.span color="blue.400">
            {installation?.team?.name ?? ""}
          </chakra.span>{" "}
          workspace.
        </Box>
        <Flex>
          <Box>
            <TestIntegrationButton
              onClick={async () => {
                await testSlackInstallation(
                  installation.incomingWebhook?.url ?? ""
                );
              }}
            />
          </Box>
          <Box>
            <RemoveIntegrationButton onClick={onOpen} />
          </Box>
        </Flex>
      </Flex>
    </>
  );
};

const InfoBarContainer: React.FC<{}> = ({ children }) => {
  return (
    <Flex
      px="10px"
      alignItems="center"
      bg={useColorModeValue("white", "gray.950")}
      py="4"
      w="full"
      mb="15px"
      rounded={["lg", "full"]}
      border="1px"
      borderColor={useColorModeValue("gray.300", "gray.600")}
      transitionDuration=".2s"
      _hover={{
        border: "1px solid",
        borderColor: "blue.300",
      }}
      flexDir={["column", "row"]}
    >
      {children}
    </Flex>
  );
};

const getIntegrationInfoBars = (integrations: Integrations) => {
  return integrations.map((integration) => {
    switch (integration.type) {
      case "Slack":
        if (integration.data)
          return (
            <InfoBarContainer key={uuidv4()}>
              <SlackInstallationInfoBar
                installation={integration.data}
                mutate={integration.mutate}
              />
            </InfoBarContainer>
          );
      default:
        return <div key="key"></div>;
    }
  });
};

export const ActiveIntegrationList = ({
  integrations,
  isLoading,
}: {
  integrations: Integrations;
  isLoading: boolean;
}) => {
  // add filtering and sorting integrations

  return (
    <>
      {integrations && !isLoading && integrations.length > 0 && (
        <Flex flexDir="column"> {getIntegrationInfoBars(integrations)}</Flex>
      )}
      {integrations && !isLoading && integrations.length === 0 && (
        <Center>No Integrations found.</Center>
      )}
      {isLoading && <LoadingSpinner />}
    </>
  );
};
