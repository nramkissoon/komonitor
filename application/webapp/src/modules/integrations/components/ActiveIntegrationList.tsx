import { Box, Button, chakra, Flex, useColorModeValue } from "@chakra-ui/react";
import { SlackInstallation } from "project-types";
import { useTeam } from "../../../common/components/TeamProvider";
import { useUserIntegrations } from "../../user/client";
import { SlackSvg } from "./Icons";

const SlackInstallationInfoBar = ({
  installation,
}: {
  installation: SlackInstallation;
}) => {
  return (
    <>
      <Box marginLeft={[0, "20px"]}>{SlackSvg}</Box>
      <Flex
        mx="20px"
        alignItems="center"
        justifyContent="space-between"
        w="full"
        flexDir={["column", "row"]}
      >
        <Box>
          You will receive alerts in the{" "}
          <chakra.span color="red.400">
            {installation?.incomingWebhook?.channel ?? ""}
          </chakra.span>{" "}
          Slack channel in the{" "}
          <chakra.span color="red.400">
            {installation?.team?.name ?? ""}
          </chakra.span>{" "}
          workspace.
        </Box>
        <Box>
          <Button
            rounded="full"
            bg="#4A154B"
            _hover={{
              bg: "red.600",
            }}
            //onClick={props.openUninstallDialog}
          >
            Uninstall Slack
          </Button>
        </Box>
      </Flex>
    </>
  );
};

const InfoBarContainer: React.FC<{}> = ({ children }) => {
  return (
    <Flex
      key="slack"
      px="10px"
      alignItems="center"
      bg={useColorModeValue("white", "gray.950")}
      py="4"
      w="full"
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

const getIntegrationInfoBars = (
  integrations: { data: any; type: string }[]
) => {
  return integrations.map((integration) => {
    switch (integration.type) {
      case "Slack":
        if (integration.data)
          return (
            <InfoBarContainer key="slack">
              <SlackInstallationInfoBar installation={integration.data} />
            </InfoBarContainer>
          );
      default:
        return <div key="key"></div>;
    }
  });
};

export const ActiveIntegrationList = () => {
  const { team } = useTeam();

  const { integrations, isError } = useUserIntegrations();

  return <Flex>{getIntegrationInfoBars(integrations)}</Flex>;
};
