import { EmailIcon } from "@chakra-ui/icons";
import { Button } from "@chakra-ui/react";
import { AlertTypes } from "project-types";
import React from "react";

export function alertTypeToBadge(type: AlertTypes) {
  switch (type) {
    case "Email":
      return EmailTypeBadge;
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
