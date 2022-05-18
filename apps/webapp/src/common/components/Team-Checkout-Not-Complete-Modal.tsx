import {
  Box,
  Button,
  chakra,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Radio,
  RadioGroup,
  Stack,
  useColorModeValue,
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import React from "react";
import { Team } from "utils";
import { PLAN_PRICE_IDS } from "../../modules/billing/plans";
import { deleteTeam } from "../../modules/teams/client";

export interface NewTeamDialogProps {
  team: Team;
}

export const TeamCheckoutNotCompleteModal = ({ team }: NewTeamDialogProps) => {
  const router = useRouter();
  const [actionInProgress, setActionInProgress] = React.useState(false);
  const [priceId, setPriceId] = React.useState(PLAN_PRICE_IDS.MONTHLY.PRO);

  return (
    <Modal isOpen={true} onClose={() => {}} isCentered size={"2xl"}>
      <ModalOverlay />
      <ModalContent
        bg={useColorModeValue("white", "gray.950")}
        border="2px"
        borderColor={useColorModeValue("gray.500", "whiteAlpha.400")}
      >
        <ModalHeader
          textAlign="center"
          fontSize={"3xl"}
          bg={useColorModeValue("white", "black")}
          borderBottom="1px"
          borderColor={useColorModeValue("gray.500", "whiteAlpha.400")}
        >
          Checkout not completed for {team.id} team.
        </ModalHeader>
        <ModalBody pt="20px" fontSize={"xl"} px="0" pb="0">
          <Box px="2em" mb="1em">
            <chakra.p>We noticed something wrong with this team.</chakra.p>
            <chakra.p my="20px">
              Checkout was never completed when creating this team. Please pick
              a plan below and complete checkout to continue, or delete this
              team if you no longer need it.
            </chakra.p>
          </Box>
          <Box px="2em">
            <RadioGroup defaultValue={PLAN_PRICE_IDS.MONTHLY.PRO}>
              <Stack direction="row">
                <Radio
                  value={PLAN_PRICE_IDS.MONTHLY.PRO}
                  onChange={(e) => setPriceId(e.target.value)}
                >
                  Pro
                </Radio>
                <Radio
                  value={PLAN_PRICE_IDS.MONTHLY.BUSINESS}
                  onChange={(e) => setPriceId(e.target.value)}
                >
                  Business
                </Radio>
              </Stack>
            </RadioGroup>
          </Box>
          <Box
            fontSize={"xl"}
            textAlign="center"
            py="1em"
            bg={useColorModeValue("white", "black")}
            borderBottom="1px"
            borderTop={"1px"}
            borderColor={useColorModeValue("gray.500", "whiteAlpha.400")}
            mt="20px"
          >
            Continuing will direct you to Stripe to initiate a 14 day trial.
          </Box>
        </ModalBody>
        <ModalFooter bg={useColorModeValue("white", "black")}>
          <Button
            isLoading={actionInProgress}
            loadingText={"Deleting"}
            size="md"
            colorScheme="gray"
            color="white"
            bg="red.500"
            fontSize="md"
            shadow="sm"
            fontWeight="normal"
            _hover={{ bg: "red.600" }}
            px="5"
            mr={3}
            onClick={async () => {
              setActionInProgress(true);
              await deleteTeam({ id: team.id });
              setActionInProgress(false);
              router.push("/app");
            }}
          >
            Delete team
          </Button>
          <Button
            isLoading={actionInProgress}
            loadingText={"Connecting to Stripe"}
            size="md"
            colorScheme="blue"
            color="white"
            bg="blue.400"
            fontSize="md"
            shadow="sm"
            fontWeight="normal"
            _hover={{ bg: "blue.600" }}
            px="5"
            letterSpacing="wider"
            onClick={async () => {
              setActionInProgress(true);
              const res = await fetch("/api/billing/checkout-session", {
                method: "POST",
                headers: {
                  "Content-type": "application/json; charset=UTF-8",
                },
                body: JSON.stringify({
                  priceId: priceId,
                  teamId: team.id,
                }),
              });
              const stripeUrl = (await res.json()).url;
              router.push(stripeUrl);
            }}
          >
            Continue to Checkout
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
