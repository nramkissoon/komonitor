import { EmailIcon } from "@chakra-ui/icons";
import { Button } from "@chakra-ui/react";
import { AiOutlineSlack } from "react-icons/ai";
import { FaDiscord } from "react-icons/fa";
import { ChannelType } from "utils";

export function alertTypeToBadge(type: ChannelType) {
  switch (type) {
    case "Email":
      return EmailTypeBadge;
    case "Slack":
      return SlackTypeBadge;
    case "Discord":
      return DiscordTypeBadge;
    default:
      return <></>;
  }
}

export const EmailTypeBadge = (
  <Button
    leftIcon={<EmailIcon />}
    colorScheme="blue"
    variant="outline"
    as="div"
    _hover={{}}
    size="xs"
    fontWeight="normal"
  >
    Email
  </Button>
);

export const SlackTypeBadge = (
  <Button
    leftIcon={<AiOutlineSlack />}
    colorScheme="purple"
    variant="outline"
    as="div"
    _hover={{}}
    size="xs"
    fontWeight="normal"
  >
    Slack
  </Button>
);

export const DiscordTypeBadge = (
  <Button
    leftIcon={<FaDiscord />}
    colorScheme="gray"
    variant="outline"
    as="div"
    _hover={{}}
    size="xs"
    fontWeight="normal"
  >
    Discord
  </Button>
);
