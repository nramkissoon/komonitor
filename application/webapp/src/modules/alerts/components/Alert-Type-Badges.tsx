import { EmailIcon } from "@chakra-ui/icons";
import { Button } from "@chakra-ui/react";
import { AlertTypes } from "project-types";
import React from "react";
import { AiOutlineSlack } from "react-icons/ai";

export function alertTypeToBadge(type: AlertTypes) {
  switch (type) {
    case "Email":
      return EmailTypeBadge;
    case "Slack":
      return SlackTypeBadge;
    default:
      return <></>;
  }
}

export const EmailTypeBadge = (
  <Button
    leftIcon={<EmailIcon />}
    colorScheme="gray"
    variant="outline"
    as="div"
    _hover={{}}
    size="xs"
    color="gray.500"
    fontWeight="normal"
  >
    Email
  </Button>
);

export const SlackTypeBadge = (
  <Button
    leftIcon={<AiOutlineSlack />}
    colorScheme="gray"
    variant="outline"
    as="div"
    _hover={{}}
    size="xs"
    color="gray.500"
    fontWeight="normal"
  >
    Email
  </Button>
);
