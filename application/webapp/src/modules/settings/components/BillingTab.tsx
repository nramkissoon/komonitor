import { Badge, Button, Divider, Text } from "@chakra-ui/react";
import React from "react";
import { getDisplayStringFromPlanProductId } from "../../../common/utils";
import { useUserServicePlanProductId } from "../../user/client";
import { createAndRedirectToCustomerPortal } from "../client";

export function BillingTab() {
  const { data, isLoading, isError } = useUserServicePlanProductId();

  return (
    <>
      <Text fontSize="lg" color="gray.500" mb=".7em">
        Current subscription plan:
      </Text>
      <Badge
        mb="1.2em"
        colorScheme="gray"
        fontSize="md"
        fontWeight="normal"
        py=".3em"
        px=".5em"
        borderRadius="lg"
        variant="subtle"
      >
        {getDisplayStringFromPlanProductId(data ? data.productId : "")}
      </Badge>
      <Divider mb="1em" />
      <Text fontSize="lg" color="gray.500" mb=".7em">
        Update/Cancel your subscription and payment methods:
      </Text>
      <Button
        fontWeight="normal"
        colorScheme="blue"
        color="white"
        bgColor="blue.500"
        shadow="sm"
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