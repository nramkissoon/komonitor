import {
  Box,
  Flex,
  Heading,
  ListItem,
  ScaleFade,
  Textarea,
  UnorderedList,
  useColorModeValue,
} from "@chakra-ui/react";
import React from "react";
import { useUserSlackInstallation } from "../../user/client";

interface OverviewPageBottomLayoutProps {
  description: string;
  recipients: string[];
  type: string;
}

export function OverviewPageBottomLayout(props: OverviewPageBottomLayoutProps) {
  const { description, recipients, type } = props;
  const { data: installation, isError, isLoading } = useUserSlackInstallation();

  return (
    <ScaleFade in={true} initialScale={0.8}>
      <Flex
        wrap="wrap"
        flexDir={["column", "column", "row"]}
        justifyContent="space-between"
      >
        <Box
          bg={useColorModeValue("white", "#0f131a")}
          shadow="md"
          mb="2em"
          borderRadius="xl"
          py="1.5em"
          w={["100%", "100%", "48%"]}
          px="1.5em"
        >
          <Heading fontWeight="medium" fontSize="lg" mb=".2em">
            Description:
          </Heading>
          <Textarea
            value={description}
            contentEditable={false}
            focusBorderColor="none"
            isReadOnly
          />
        </Box>
        <Box
          bg={useColorModeValue("white", "#0f131a")}
          shadow="md"
          mb="2em"
          borderRadius="xl"
          py="1.5em"
          w={["100%", "100%", "48%"]}
          px="1.5em"
        >
          <Heading fontWeight="medium" fontSize="lg" mb=".2em">
            {type === "Slack" ? "Slack Channel:" : "Recipients:"}
          </Heading>
          <UnorderedList spacing={3}>
            {recipients.map((recip) => (
              <ListItem key={recip} letterSpacing="wide">
                {type === "Slack" && installation
                  ? installation.incomingWebhook?.channel
                  : recip}
              </ListItem>
            ))}
          </UnorderedList>
        </Box>
      </Flex>
    </ScaleFade>
  );
}
