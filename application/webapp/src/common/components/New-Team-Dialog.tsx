import {
  Box,
  Button,
  chakra,
  Flex,
  Input,
  InputGroup,
  InputLeftAddon,
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
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/router";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { PLAN_PRICE_IDS } from "../../modules/billing/plans";
import { checkTeamExists, createTeam } from "../../modules/teams/client";
import { teamCreationInputSchema } from "../../modules/teams/server/validation";

export interface NewTeamDialogProps {
  isOpen: boolean;
  onClose: () => void;
  defaultPlanValue?: string;
}

export interface TeamCreationInputs {
  id: string;
  plan: string;
}

export const NewTeamDialog = ({
  isOpen,
  onClose,
  defaultPlanValue,
}: NewTeamDialogProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
    setError,
    control,
    setValue,
  } = useForm<TeamCreationInputs>({
    resolver: zodResolver(teamCreationInputSchema),
    defaultValues: { plan: defaultPlanValue },
  });

  const router = useRouter();

  const onSubmit: SubmitHandler<TeamCreationInputs> = async (data) => {
    const nameUnavailable = await checkTeamExists(data.id);

    if (nameUnavailable) {
      setError("id", { message: "Name is unavailable." });
      return;
    }

    await createTeam({
      id: data.id,
      plan: data.plan,
      onSuccess: async (plan: string, id: string) => {
        const res = await fetch("/api/billing/checkout-session", {
          method: "POST",
          headers: {
            "Content-type": "application/json; charset=UTF-8",
          },
          body: JSON.stringify({ priceId: plan, teamId: id }),
        });
        const stripeUrl = (await res.json()).url;
        router.push(stripeUrl);
      },
      onError: (m: string) => {},
    });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered size={"2xl"}>
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
          Create a Team
        </ModalHeader>
        <ModalBody pt="20px" fontSize={"xl"} px="0" pb="0">
          <Box px="2em" mb="1em">
            <chakra.p>
              This is your team's visible name within Komonitor. For example,
              the name of your company or department.
            </chakra.p>
            <chakra.p my="20px">
              We'll use your team name to create a namespace on Komonitor.
              Within it, your team can inspect their projects, check out any
              recent activity, or configure settings to their liking.
            </chakra.p>
            <chakra.p>
              Team names are unique across Komonitor, so your desired team name
              may not be available.
            </chakra.p>
          </Box>
          <Box px="2em">
            <chakra.form>
              <Flex alignItems="center" justifyContent="space-between">
                <InputGroup>
                  <InputLeftAddon children="komonitor.com/teams/" />
                  <Input placeholder={"Team Name"} {...register("id")} />
                </InputGroup>
              </Flex>
              <chakra.div color="red.400" mt="6px" fontSize={"md"}>
                {errors.id?.message}
              </chakra.div>
              <Controller
                name="plan"
                control={control}
                render={({ field: { onChange, value }, fieldState }) => (
                  <RadioGroup
                    onChange={(e) => {
                      setValue("plan", e);
                    }}
                    value={value}
                  >
                    <Stack direction="row">
                      <Radio value={PLAN_PRICE_IDS.MONTHLY.PRO}>Pro</Radio>
                      <Radio value={PLAN_PRICE_IDS.MONTHLY.BUSINESS}>
                        Business
                      </Radio>
                    </Stack>
                    <chakra.div color="red.400" mt="6px" fontSize={"md"}>
                      {errors.plan?.message}
                    </chakra.div>
                  </RadioGroup>
                )}
              />
            </chakra.form>
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
            size="md"
            colorScheme="gray"
            color="white"
            bg="gray.500"
            fontSize="md"
            shadow="sm"
            fontWeight="normal"
            _hover={{ bg: "gray.600" }}
            px="5"
            mr={3}
            onClick={onClose}
          >
            Close
          </Button>
          <Button
            isLoading={isSubmitting}
            type="submit"
            size="md"
            colorScheme="blue"
            color="white"
            bg="blue.400"
            fontSize="md"
            shadow="sm"
            fontWeight="normal"
            _hover={{ bg: "blue.600" }}
            px="5"
            isDisabled={errors.id !== undefined}
            letterSpacing="wider"
            onClick={handleSubmit(onSubmit)}
          >
            Create
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
