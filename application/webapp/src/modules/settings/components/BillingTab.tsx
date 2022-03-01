import {
  Badge,
  Box,
  Button,
  Divider,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import { getDisplayStringFromPlanProductId } from "../../../common/utils";
import { useUserServicePlanProductId } from "../../user/client";
import { createAndRedirectToCustomerPortal } from "../client";

export function BillingTab() {
  const { data, isLoading, isError } = useUserServicePlanProductId();
  const { teamId } = useRouter().query;

  return (
    <>
      <Box
        bg={useColorModeValue("white", "gray.950")}
        rounded="md"
        shadow="md"
        pt="20px"
        pb="20px"
        px="20px"
      >
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
          Update your subscription and payment methods:
        </Text>
        <Button
          fontWeight="normal"
          colorScheme="blue"
          color="white"
          bgColor="blue.500"
          shadow="sm"
          onClick={() => createAndRedirectToCustomerPortal(teamId as string)}
          _hover={{
            bg: "blue.600",
          }}
        >
          Manage Subscription
        </Button>
      </Box>
      <Box
        bg={useColorModeValue("white", "gray.950")}
        rounded="md"
        shadow="md"
        pt="20px"
        pb="20px"
        px="20px"
        mt="20px"
      >
        <Text
          fontSize="lg"
          color={useColorModeValue("red.500", "red.400")}
          mb=".7em"
        >
          Danger Zone:
        </Text>

        <Button
          fontWeight="normal"
          colorScheme="red"
          color="white"
          bgColor="red.500"
          shadow="sm"
          onClick={() => {}}
          _hover={{
            bg: "red.600",
          }}
        >
          Delete Team
        </Button>
      </Box>
    </>
  );
}
