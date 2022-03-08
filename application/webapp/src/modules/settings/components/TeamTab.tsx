import { AddIcon, DeleteIcon } from "@chakra-ui/icons";
import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Badge,
  Box,
  Button,
  chakra,
  Divider,
  Flex,
  FormLabel,
  IconButton,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Radio,
  RadioGroup,
  Stack,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tooltip,
  Tr,
  useColorModeValue,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import router, { useRouter } from "next/router";
import React, { RefObject } from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { KeyedMutator } from "swr";
import { Team, TeamMember, TeamPermissionLevel } from "utils";
import { timeAgo } from "../../../common/client-utils";
import { getDisplayStringFromPlanProductId } from "../../../common/utils";
import { PLAN_PRODUCT_IDS, TEAM_MEMBER_LIMITS } from "../../billing/plans";
import { useTeam } from "../../teams/client";
import { teamInvitationInputSchema } from "../../teams/server/validation";
import { useUser } from "../../user/client";
import {
  createAndRedirectToCustomerPortal,
  createInvite,
  deleteInvite,
  deleteMember,
  deleteTeam,
  getUserPermissionLevel,
  useProductId,
} from "../client";

const RoleBadge = ({ role }: { role: TeamPermissionLevel }) => {
  return (
    <Badge
      colorScheme={role === "admin" ? "purple" : "gray"}
      variant="outline"
      px="8px"
    >
      {role}
    </Badge>
  );
};

function useDeleteInviteDialog() {
  const cancelRef = React.useRef(true);
  const { isOpen, onOpen, onClose } = useDisclosure();

  return {
    deleteInviteCancelRef: cancelRef,
    deleteInviteIsOpen: isOpen,
    deleteInviteOnClose: onClose,
    deleteInviteOnOpen: onOpen,
  };
}

interface DeleteInviteDialogProps {
  teamId: string;
  email: string;
  mutate: KeyedMutator<any>;
  isOpen: boolean;
  onClose: () => void;
  leastDestructiveRef: RefObject<any>;
  onError: (message: string) => void;
  onSuccess: (message: string) => void;
}

const DeleteInviteDialog = ({
  teamId,
  email,
  isOpen,
  onClose,
  leastDestructiveRef,
  onError,
  mutate,
  onSuccess,
}: DeleteInviteDialogProps) => {
  return (
    <AlertDialog
      leastDestructiveRef={leastDestructiveRef}
      isOpen={isOpen}
      onClose={onClose}
      size="2xl"
      isCentered
    >
      <AlertDialogOverlay />
      <AlertDialogContent
        bg={useColorModeValue("white", "gray.950")}
        border="2px"
        borderColor={useColorModeValue("gray.500", "whiteAlpha.400")}
      >
        <AlertDialogHeader
          textAlign="center"
          fontSize={"2xl"}
          bg={useColorModeValue("white", "black")}
          borderBottom="1px"
          borderColor={useColorModeValue("gray.500", "whiteAlpha.400")}
        >
          Delete Invite for {email}?
        </AlertDialogHeader>
        <AlertDialogBody
          pt="20px"
          fontSize={"lg"}
          px="2em"
          pb="0"
          textAlign={"center"}
        >
          <Text mb="1em">
            This action will invalidate and delete this team invite.
          </Text>
          <Text mb="1em">You can recreate this invite later if you wish.</Text>
        </AlertDialogBody>
        <AlertDialogFooter
          bg={useColorModeValue("white", "black")}
          justifyContent="center"
        >
          <Button
            ref={leastDestructiveRef}
            onClick={onClose}
            size="md"
            colorScheme="gray"
            color="white"
            bg="gray.500"
            fontSize="md"
            shadow="sm"
            fontWeight="normal"
            mr={3}
            _hover={{ bg: "gray.600" }}
            px="10"
          >
            Cancel
          </Button>
          <Button
            size="md"
            colorScheme="red"
            color="white"
            bg="red.500"
            fontSize="md"
            shadow="sm"
            fontWeight="normal"
            _hover={{ bg: "red.600" }}
            px="10"
            onClick={async () => {
              await deleteInvite(
                teamId,
                email,
                (message: string) => {
                  mutate();
                  onClose();
                  onSuccess(message);
                },
                (message: string) => {
                  onClose();
                  onError(message);
                }
              );
            }}
          >
            Delete
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

function useLeaveTeamDialog() {
  const cancelRef = React.useRef(true);
  const { isOpen, onOpen, onClose } = useDisclosure();

  return {
    leaveTeamCancelRef: cancelRef,
    leaveTeamIsOpen: isOpen,
    leaveTeamOnClose: onClose,
    leaveTeamOnOpen: onOpen,
  };
}

interface LeaveTeamDialogProps {
  teamId: string;
  isOpen: boolean;
  onClose: () => void;
  leastDestructiveRef: RefObject<any>;
  onError: (message: string) => void;
}

const LeaveTeamDialog = ({
  isOpen,
  onClose,
  leastDestructiveRef,
  onError,
  teamId,
}: LeaveTeamDialogProps) => {
  const { user, userMutate } = useUser();

  return (
    <AlertDialog
      leastDestructiveRef={leastDestructiveRef}
      isOpen={isOpen}
      onClose={onClose}
      size="2xl"
      isCentered
    >
      <AlertDialogOverlay />
      <AlertDialogContent
        bg={useColorModeValue("white", "gray.950")}
        border="2px"
        borderColor={useColorModeValue("gray.500", "whiteAlpha.400")}
      >
        <AlertDialogHeader
          textAlign="center"
          fontSize={"2xl"}
          bg={useColorModeValue("white", "black")}
          borderBottom="1px"
          borderColor={useColorModeValue("gray.500", "whiteAlpha.400")}
        >
          Leave {teamId} team?
        </AlertDialogHeader>
        <AlertDialogBody
          pt="20px"
          fontSize={"lg"}
          px="2em"
          pb="0"
          textAlign={"center"}
        >
          <Text mb="1em">This action will remove you from the team.</Text>
          <Text mb="1em">
            You will not be able to access any projects or monitors going
            forward.
          </Text>
        </AlertDialogBody>
        <AlertDialogFooter
          bg={useColorModeValue("white", "black")}
          justifyContent="center"
        >
          <Button
            ref={leastDestructiveRef}
            onClick={onClose}
            size="md"
            colorScheme="gray"
            color="white"
            bg="gray.500"
            fontSize="md"
            shadow="sm"
            fontWeight="normal"
            mr={3}
            _hover={{ bg: "gray.600" }}
            px="10"
          >
            Cancel
          </Button>
          <Button
            size="md"
            colorScheme="red"
            color="white"
            bg="red.500"
            fontSize="md"
            shadow="sm"
            fontWeight="normal"
            _hover={{ bg: "red.600" }}
            px="10"
            onClick={async () => {
              await deleteMember(
                teamId,
                user.id,
                (message: string) => {
                  userMutate();
                  router.push("/app?leftTeam=true");
                },
                (message: string) => {
                  onClose();
                  onError(message);
                }
              );
            }}
          >
            Leave Team
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

function useRemoveMemberDialog() {
  const cancelRef = React.useRef(true);
  const { isOpen, onOpen, onClose } = useDisclosure();

  return {
    removeMemberCancelRef: cancelRef,
    removeMemberIsOpen: isOpen,
    removeMemberOnClose: onClose,
    removeMemberOnOpen: onOpen,
  };
}

interface RemoveMemberDialogProps {
  teamId: string;
  member: TeamMember | null;
  mutate: KeyedMutator<any>;
  isOpen: boolean;
  onClose: () => void;
  leastDestructiveRef: RefObject<any>;
  onError: (message: string) => void;
  onSuccess: (message: string) => void;
}

const RemoveMemberDialog = ({
  member,
  isOpen,
  onClose,
  leastDestructiveRef,
  onError,
  mutate,
  onSuccess,
  teamId,
}: RemoveMemberDialogProps) => {
  return (
    <AlertDialog
      leastDestructiveRef={leastDestructiveRef}
      isOpen={isOpen}
      onClose={onClose}
      size="2xl"
      isCentered
    >
      <AlertDialogOverlay />
      <AlertDialogContent
        bg={useColorModeValue("white", "gray.950")}
        border="2px"
        borderColor={useColorModeValue("gray.500", "whiteAlpha.400")}
      >
        <AlertDialogHeader
          textAlign="center"
          fontSize={"2xl"}
          bg={useColorModeValue("white", "black")}
          borderBottom="1px"
          borderColor={useColorModeValue("gray.500", "whiteAlpha.400")}
        >
          Remove {member?.name ?? member?.email} from team?
        </AlertDialogHeader>
        <AlertDialogBody
          pt="20px"
          fontSize={"lg"}
          px="2em"
          pb="0"
          textAlign={"center"}
        >
          <Text mb="1em">
            This action will remove team member and their ability to access any
            projects and monitors owned by the team.
          </Text>
          <Text mb="1em">
            You can always reinvite the removed member later.
          </Text>
        </AlertDialogBody>
        <AlertDialogFooter
          bg={useColorModeValue("white", "black")}
          justifyContent="center"
        >
          <Button
            ref={leastDestructiveRef}
            onClick={onClose}
            size="md"
            colorScheme="gray"
            color="white"
            bg="gray.500"
            fontSize="md"
            shadow="sm"
            fontWeight="normal"
            mr={3}
            _hover={{ bg: "gray.600" }}
            px="10"
          >
            Cancel
          </Button>
          <Button
            size="md"
            colorScheme="red"
            color="white"
            bg="red.500"
            fontSize="md"
            shadow="sm"
            fontWeight="normal"
            _hover={{ bg: "red.600" }}
            px="10"
            onClick={async () => {
              await deleteMember(
                teamId,
                member?.user_id ?? "",
                (message: string) => {
                  mutate();
                  onClose();
                  onSuccess(message);
                },
                (message: string) => {
                  onClose();
                  onError(message);
                }
              );
            }}
          >
            Remove
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

function useDeleteTeamDialog() {
  const cancelRef = React.useRef(true);
  const { isOpen, onOpen, onClose } = useDisclosure();

  return {
    cancelRef,
    isOpen,
    onClose,
    onOpen,
  };
}

interface DeleteTeamDialogProps {
  teamId: string;
  isOpen: boolean;
  onClose: () => void;
  leastDestructiveRef: RefObject<any>;
  onError: (message: string) => void;
}

function DeleteTeamDialog(props: DeleteTeamDialogProps) {
  const { isOpen, onClose, leastDestructiveRef, onError, teamId } = props;
  const { user, userMutate } = useUser();
  const [inputVal, setInputVal] = React.useState("");
  const [inputIsError, setInputIsError] = React.useState("");
  const handleInputChange = (event: {
    target: { value: React.SetStateAction<string> };
  }) => setInputVal(event.target.value);

  const handleOnSubmit = async () => {
    if (inputVal && inputVal !== "delete") {
      setInputIsError(
        "Enter 'delete' in the input above to cancel subscription and delete team."
      );
      return;
    } else if (inputVal === "delete") {
      const deleted = await deleteTeam(teamId, onError);

      if (deleted) {
        await userMutate();
        router.push("/app?teamDeleted=true");
      }
    }
  };

  const resetOnClose = () => {
    setInputVal("");
    setInputIsError("");
    onClose();
  };

  return (
    <AlertDialog
      leastDestructiveRef={leastDestructiveRef}
      isOpen={isOpen}
      onClose={resetOnClose}
      size="2xl"
    >
      <AlertDialogContent>
        <AlertDialogHeader fontSize="2xl" fontWeight="normal">
          Delete Team
        </AlertDialogHeader>
        <AlertDialogBody>
          <Text mb="1em">
            Are you sure? Your team and associated projects/monitors will be{" "}
            <chakra.span color="red.500" fontSize="lg" fontWeight="semibold">
              permanently
            </chakra.span>{" "}
            deleted. You cannot undo this action afterwards.
          </Text>
          <Text mb="1em">
            Note: This will cancel your subscription plan as well.
          </Text>
          <Text>
            Enter{" "}
            <chakra.span color="red.500" fontSize="lg">
              delete
            </chakra.span>{" "}
            below to confirm:
          </Text>
          <Input
            value={inputVal}
            onChange={handleInputChange}
            placeholder="delete"
            mb="1"
            shadow="sm"
          />
          <Text color="red.500">{inputIsError}</Text>
        </AlertDialogBody>
        <AlertDialogFooter>
          <Button
            ref={leastDestructiveRef}
            onClick={resetOnClose}
            mr="1.5em"
            fontWeight="normal"
          >
            Cancel
          </Button>
          <Button
            colorScheme="red"
            color="white"
            bgColor="red.500"
            fontWeight="normal"
            onClick={handleOnSubmit}
          >
            Delete
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

interface TeamInviteInputs {
  permission: TeamPermissionLevel;
  email: string;
}

interface AddTeamInviteFormProps {
  mutate: KeyedMutator<any>;
  onSuccess: (message: string) => void;
  onError: (message: string) => void;
  isOpen: boolean;
  onClose: () => void;
}

const AddTeamInviteForm = ({
  mutate,
  onError,
  onSuccess,
  isOpen,
  onClose,
}: AddTeamInviteFormProps) => {
  const {
    register,
    reset,
    setError,
    handleSubmit,
    control,
    setValue,
    formState: { isSubmitting, errors },
  } = useForm<TeamInviteInputs>({
    resolver: zodResolver(teamInvitationInputSchema),
    defaultValues: { permission: "view" },
  });
  const { teamId } = useRouter().query;

  const onSubmit: SubmitHandler<TeamInviteInputs> = async (data) => {
    await createInvite(
      teamId as string,
      data.email,
      data.permission,
      (message: string) => {
        mutate();
        onClose();
        onSuccess(message);
      },
      (message: string) => {
        onClose();
        onError(message);
      }
    );
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
          Invite a Teammate
        </ModalHeader>
        <ModalBody pt="20px" fontSize={"xl"} px="0" pb="0">
          <Box px="2em" mb="1em">
            <chakra.p>
              Enter your teammate's email below to send them an invite to join{" "}
              {teamId}.
            </chakra.p>
          </Box>
          <Box px="2em" mb="20px">
            <chakra.form>
              <Flex flexDir={"column"}>
                <Box flexGrow={1}>
                  <FormLabel>Email address:</FormLabel>
                  <Input placeholder={"Email"} {...register("email")} />
                  <chakra.div color="red.400" mt="6px" fontSize={"md"}>
                    {errors.email?.message}
                  </chakra.div>
                </Box>
                <Box mt="7px">
                  <Controller
                    control={control}
                    name="permission"
                    render={({ field, fieldState }) => (
                      <RadioGroup
                        onChange={(e) => {
                          setValue("permission", e as TeamPermissionLevel);
                        }}
                        value={field.value}
                      >
                        <FormLabel>Permission level:</FormLabel>
                        <Stack direction="row">
                          <Radio value={"view"}>Can View</Radio>
                          <Radio value={"edit"}>Can Edit</Radio>
                        </Stack>
                        <chakra.div color="red.400" mt="6px" fontSize={"md"}>
                          {errors.permission?.message}
                        </chakra.div>
                      </RadioGroup>
                    )}
                  />
                </Box>
              </Flex>
            </chakra.form>
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
            onClick={() => {
              onClose();
            }}
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
            isDisabled={
              errors.email !== undefined && errors.permission !== undefined
            }
            letterSpacing="wider"
            onClick={handleSubmit(onSubmit)}
          >
            Send Invite
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export function TeamTab() {
  const { user, userIsLoading } = useUser();
  const { teamId } = useRouter().query;
  const { productId, productIdIsLoading } = useProductId(teamId as string);
  const toast = useToast();
  const postErrorToast = (message: string) =>
    toast({
      title: "Unable to perform action.",
      description: message,
      status: "error",
      duration: 9000,
      isClosable: true,
      variant: "solid",
      position: "top",
    });
  const postSuccessToast = (message: string) => {
    toast({
      title: "Success!",
      description: message,
      status: "success",
      duration: 9000,
      isClosable: true,
      variant: "solid",
      position: "top",
    });
  };
  const { cancelRef, isOpen, onClose, onOpen } = useDeleteTeamDialog();
  const { team, teamIsLoading, mutateTeams } = useTeam(teamId as string);
  const {
    isOpen: inviteFormIsOpen,
    onClose: inviteFormOnClose,
    onOpen: inviteFormOnOpen,
  } = useDisclosure();

  const [inviteToDelete, setInviteToDelete] = React.useState("");
  const {
    deleteInviteCancelRef,
    deleteInviteIsOpen,
    deleteInviteOnClose,
    deleteInviteOnOpen,
  } = useDeleteInviteDialog();

  const [userToRemove, setUserToRemove] = React.useState<TeamMember | null>(
    null
  );
  const {
    removeMemberCancelRef,
    removeMemberIsOpen,
    removeMemberOnClose,
    removeMemberOnOpen,
  } = useRemoveMemberDialog();

  const {
    leaveTeamCancelRef,
    leaveTeamIsOpen,
    leaveTeamOnClose,
    leaveTeamOnOpen,
  } = useLeaveTeamDialog();

  function teamMemberLimit(team: Team) {
    if (team.product_id === PLAN_PRODUCT_IDS.PRO) return TEAM_MEMBER_LIMITS.PRO;
    return TEAM_MEMBER_LIMITS.BUSINESS;
  }

  const userPermissionLevel = getUserPermissionLevel(user, team);

  return (
    <>
      <DeleteTeamDialog
        teamId={teamId as string}
        leastDestructiveRef={cancelRef}
        isOpen={isOpen}
        onClose={onClose}
        onError={postErrorToast}
      />
      <AddTeamInviteForm
        mutate={mutateTeams}
        onError={postErrorToast}
        onSuccess={postSuccessToast}
        isOpen={inviteFormIsOpen}
        onClose={inviteFormOnClose}
      />
      <LeaveTeamDialog
        isOpen={leaveTeamIsOpen}
        onClose={leaveTeamOnClose}
        leastDestructiveRef={leaveTeamCancelRef}
        teamId={teamId as string}
        onError={postErrorToast}
      />
      <DeleteInviteDialog
        mutate={mutateTeams}
        onClose={deleteInviteOnClose}
        isOpen={deleteInviteIsOpen}
        onError={postErrorToast}
        teamId={teamId as string}
        email={inviteToDelete}
        onSuccess={postSuccessToast}
        leastDestructiveRef={deleteInviteCancelRef}
      />
      <RemoveMemberDialog
        mutate={mutateTeams}
        onClose={removeMemberOnClose}
        isOpen={removeMemberIsOpen}
        leastDestructiveRef={removeMemberCancelRef}
        onSuccess={postSuccessToast}
        onError={postErrorToast}
        teamId={teamId as string}
        member={userToRemove}
      />
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
          colorScheme="gray"
          fontSize="md"
          fontWeight="normal"
          py=".3em"
          px=".5em"
          borderRadius="lg"
          variant="subtle"
        >
          {getDisplayStringFromPlanProductId(
            productId ? productId : "Loading..."
          )}
        </Badge>
        {userPermissionLevel === "admin" && (
          <>
            <Divider mb="1em" mt="1.2em" />
            <Text fontSize="lg" color="gray.500" mb=".7em">
              Update your subscription and payment methods with Stripe (admin
              only):
            </Text>
            <Button
              fontWeight="normal"
              colorScheme="blue"
              color="white"
              bgColor="blue.500"
              shadow="sm"
              onClick={() =>
                createAndRedirectToCustomerPortal(teamId as string)
              }
              _hover={{
                bg: "blue.600",
              }}
            >
              Manage Subscription
            </Button>
          </>
        )}
      </Box>
      {!teamIsLoading && (
        <Box
          bg={useColorModeValue("white", "gray.950")}
          rounded="md"
          shadow="md"
          pt="20px"
          pb="20px"
          px="20px"
          mt="20px"
        >
          <Text fontSize="lg" color="gray.500" mb=".7em">
            Team Members ({`${team.members.length}/${teamMemberLimit(team)}`})
          </Text>
          <Table variant={"simple"}>
            <Thead>
              <Tr>
                <Th>Email</Th>
                <Th>Name</Th>
                <Th>Permissions</Th>
                <Th>Actions</Th>
              </Tr>
            </Thead>
            <Tbody>
              {team.members.map((member) => (
                <Tr key={member.user_id}>
                  <Td>{member.email}</Td>
                  <Td>{member.name ?? "N/A"}</Td>
                  <Td>
                    <RoleBadge role={member.permission_level} />
                  </Td>
                  <Td>
                    {member.permission_level === "admin" &&
                    userPermissionLevel === "admin" ? (
                      <Tooltip label={"Admin cannot be removed from team."}>
                        <IconButton
                          size={"sm"}
                          icon={<DeleteIcon />}
                          fontWeight="normal"
                          colorScheme="red"
                          color="white"
                          bgColor="red.500"
                          shadow="sm"
                          onClick={() => {}}
                          _hover={{
                            bg: "red.600",
                          }}
                          aria-label={"remove team member"}
                          isDisabled
                        ></IconButton>
                      </Tooltip>
                    ) : (
                      <>
                        <Tooltip
                          label={
                            userPermissionLevel === "admin"
                              ? `Remove ${
                                  member.name ?? member.email
                                } from team`
                              : "Admin permission required."
                          }
                        >
                          <IconButton
                            size={"sm"}
                            icon={<DeleteIcon />}
                            fontWeight="normal"
                            colorScheme="red"
                            color="white"
                            bgColor="red.500"
                            shadow="sm"
                            onClick={() => {
                              setUserToRemove(member);
                              removeMemberOnOpen();
                            }}
                            _hover={{
                              bg: "red.600",
                            }}
                            aria-label={"remove team member"}
                            isDisabled={userPermissionLevel !== "admin"}
                          >
                            Remove Team Member
                          </IconButton>
                        </Tooltip>
                      </>
                    )}
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </Box>
      )}
      {!teamIsLoading && (
        <Box
          bg={useColorModeValue("white", "gray.950")}
          rounded="md"
          shadow="md"
          pt="20px"
          pb="20px"
          px="20px"
          mt="20px"
        >
          <Text fontSize="lg" color="gray.500" mb=".7em">
            Team Invitations
          </Text>
          <Table variant={"simple"} mb="20px">
            <Thead>
              <Tr>
                <Th>Email</Th>
                <Th>Permissions</Th>
                <Th>Expiration</Th>
                <Th>Actions</Th>
              </Tr>
            </Thead>
            <Tbody>
              {team.invites.map((invite) => (
                <Tr key={invite.team_id_invite_code_composite_key}>
                  <Td>{invite.email}</Td>
                  <Td>
                    <RoleBadge role={invite.permission_level} />
                  </Td>
                  <Td>{timeAgo.format(invite.expiration)}</Td>
                  <Td>
                    <Tooltip label={`Delete invite for ${invite.email}`}>
                      <IconButton
                        size={"sm"}
                        icon={<DeleteIcon />}
                        fontWeight="normal"
                        colorScheme="red"
                        color="white"
                        bgColor="red.500"
                        shadow="sm"
                        onClick={() => {
                          setInviteToDelete(invite.email);
                          deleteInviteOnOpen();
                        }}
                        _hover={{
                          bg: "red.600",
                        }}
                        aria-label={"delete invite"}
                      >
                        Delete Invite
                      </IconButton>
                    </Tooltip>
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
          <Button
            leftIcon={<AddIcon />}
            fontWeight="normal"
            colorScheme="blue"
            color="white"
            bgColor="blue.500"
            shadow="sm"
            onClick={() => inviteFormOnOpen()}
            _hover={{
              bg: "blue.600",
            }}
          >
            Invite Teammate
          </Button>
        </Box>
      )}
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

        {userPermissionLevel === "admin" && (
          <Button
            fontWeight="normal"
            colorScheme="red"
            color="white"
            bgColor="red.500"
            shadow="sm"
            onClick={() => {
              onOpen();
            }}
            _hover={{
              bg: "red.600",
            }}
          >
            Delete Team
          </Button>
        )}
        {userPermissionLevel !== "admin" && (
          <Button
            fontWeight="normal"
            colorScheme="red"
            color="white"
            bgColor="red.500"
            shadow="sm"
            onClick={() => {
              leaveTeamOnOpen();
            }}
            _hover={{
              bg: "red.600",
            }}
          >
            Leave Team
          </Button>
        )}
      </Box>
    </>
  );
}
