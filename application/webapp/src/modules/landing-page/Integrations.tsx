import { ArrowForwardIcon } from "@chakra-ui/icons";
import {
  Box,
  chakra,
  Flex,
  Grid,
  GridItem,
  useColorModeValue,
} from "@chakra-ui/react";
import Link from "next/link";
import {
  DiscordSvg,
  GmailSvg,
  SlackSvg,
  WebhookSvg,
} from "../integrations/components/Icons";

export const IntegrationSection = () => {
  return (
    <Flex flexDir="column" alignItems="center" as="section">
      <chakra.h2
        textAlign="center"
        fontSize="5xl"
        fontWeight="extrabold"
        color={useColorModeValue("gray.800", "gray.100")}
        lineHeight="shorter"
        mb="10px"
      >
        Integrate With Your Favorite Tools
      </chakra.h2>
      <chakra.h3
        fontSize="2xl"
        fontWeight="bold"
        textAlign="center"
        lineHeight="shorter"
        w={["70%"]}
        mx="auto"
        color={useColorModeValue("gray.600", "gray.400")}
        mb="2em"
      >
        Receive alerts and updates via services you and your team already use.
      </chakra.h3>
      <Grid
        templateColumns={[
          "repeat(1, 1fr)",
          "repeat(2, 1fr)",
          null,
          null,
          null,
          "repeat(4, 1fr)",
        ]}
        columnGap={[10, null, null, null, null, 6]}
        rowGap={[10, null, null, null, null, 6]}
        maxW="9xl"
        mb="10px"
      >
        <IntegrationInfoCard
          icon={SlackSvg}
          description="Send alerts directly to your Slack channels. Connect your account in a few clicks with OAuth2."
          name="Slack"
          bg="#611f69"
          href="/integrations/slack"
        />
        <IntegrationInfoCard
          icon={GmailSvg}
          description="Send alerts and weekly monitor reports to your inbox in just a couple of clicks."
          name="Email"
          bg="blue.600"
          href="/integrations/email"
        />
        <IntegrationInfoCard
          icon={DiscordSvg}
          description="Send alerts to your Discord server. Connect your account with OAuth2."
          name="Discord"
          bg="#23272a"
          href="/integrations/discord"
        />
        <IntegrationInfoCard
          icon={WebhookSvg}
          description="Send alerts and monitor statuses directly to your own application endpoints with webhooks."
          name="Webhooks"
          bg="pink.500"
          href="/integrations/webhook"
        />
      </Grid>
      <chakra.h3
        fontSize="2xl"
        fontWeight="bold"
        textAlign="center"
        lineHeight="shorter"
        w={["70%"]}
        mx="auto"
        color={useColorModeValue("gray.600", "gray.400")}
        mt="15px"
      >
        Don't worry if your tool isn't listed here. We got more integrations on
        the way!
      </chakra.h3>
    </Flex>
  );
};

const IntegrationInfoCard: React.FC<{
  icon: React.ReactElement;
  name: string;
  description: string;
  bg: string;
  href: string;
}> = ({ icon, name, description, bg, href }) => {
  return (
    <GridItem
      px="20px"
      bg={bg}
      py="4"
      rounded="2xl"
      transitionDuration=".2s"
      _hover={{
        transform: "scale(1.07)",
      }}
      flexDir={["column", "row"]}
      justifySelf="center"
      maxW="300px"
      shadow={"xl"}
      role="group"
    >
      <Flex
        flexDir="column"
        color="white"
        justifyContent={"space-between"}
        h="full"
      >
        <Box>
          <Box
            boxSize={16}
            p="10px"
            bg="white"
            rounded="xl"
            display={"table-cell"}
            verticalAlign="middle"
          >
            {icon}
          </Box>
          <Box fontSize={"3xl"} fontWeight="bold" my="6px">
            {name}
          </Box>
          <Box fontSize="xl">{description}</Box>
        </Box>
        <Box fontSize="lg" alignSelf={"end"} mt="2px">
          <Link href={href}>Learn more</Link>
          <ArrowForwardIcon
            ml="2px"
            opacity={0}
            transitionDuration=".2s"
            _groupHover={{ opacity: 1 }}
          />
        </Box>
      </Flex>
    </GridItem>
  );
};
