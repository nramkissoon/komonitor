import { Button, Text } from "@chakra-ui/react";
import React from "react";
import { createAndRedirectToCustomerPortal } from "../client";

export function BillingTab() {
  return (
    <>
      <Text fontSize="lg" color="gray.500" mb=".7em">
        Update/Cancel your subscription:
      </Text>
      <Button
        fontWeight="normal"
        colorScheme="blue"
        color="white"
        bgColor="blue.500"
        onClick={() => createAndRedirectToCustomerPortal()}
        _hover={{
          bg: "blue.600",
        }}
      >
        Manage Subscription
      </Button>
    </>
  );
}
