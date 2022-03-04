import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  Box,
  Button,
  chakra,
  Flex,
  Heading,
  Input,
  InputGroup,
  InputLeftAddon,
  Text,
  useColorModeValue,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import React, { RefObject } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { useAppBaseRoute } from "../../../../../src/common/client-utils";
import { AppSubNav } from "../../../../../src/common/components/App-Sub-Nav";
import { PageLayout } from "../../../../../src/common/components/Page-Layout";
import {
  deleteProject,
  updateProject,
  useProjects,
} from "../../../../../src/modules/projects/client/client";
import { ExtendedNextPage } from "../../../../_app";

function useDeleteProjectDialog() {
  const cancelRef = React.useRef(true);
  const { isOpen, onOpen, onClose } = useDisclosure();

  return {
    cancelRef,
    isOpen,
    onClose,
    onOpen,
  };
}

interface DeleteProjectDialogProps {
  isOpen: boolean;
  onClose: () => void;
  leastDestructiveRef: RefObject<any>;
  onError: (message: string) => void;
  projectName: string;
  teamId?: string;
}

function DeleteProjectDialog(props: DeleteProjectDialogProps) {
  const { isOpen, onClose, leastDestructiveRef, onError, projectName, teamId } =
    props;
  const router = useRouter();

  const errorToast = useToast();
  const baseRoute = useAppBaseRoute();
  const postErrorToast = (message: string) =>
    errorToast({
      title: "Unable to perform action",
      description: message,
      status: "error",
      duration: 9000,
      isClosable: true,
      variant: "solid",
      position: "top",
    });
  const [inputVal, setInputVal] = React.useState("");
  const [inputIsError, setInputIsError] = React.useState("");
  const handleInputChange = (event: {
    target: { value: React.SetStateAction<string> };
  }) => setInputVal(event.target.value);

  const handleOnSubmit = async () => {
    if (inputVal && inputVal !== projectName) {
      setInputIsError("Enter project name in the input above to delete.");
      return;
    } else if (inputVal === projectName) {
      await deleteProject(
        projectName,
        () => {
          router.push(baseRoute);
        },
        () =>
          postErrorToast("An unknown error occurred. Please try again later."),
        teamId as string
      );
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
          Delete Project
        </AlertDialogHeader>
        <AlertDialogBody>
          <Text mb="1em">
            Are you sure? This project and associated monitors will be{" "}
            <chakra.span color="red.500" fontSize="lg" fontWeight="semibold">
              permanently
            </chakra.span>{" "}
            deleted. You cannot undo this action afterwards.
          </Text>
          <Text>Enter project name below to confirm:</Text>
          <Input
            value={inputVal}
            onChange={handleInputChange}
            placeholder={projectName}
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

const NameChangeForm = ({ currentName }: { currentName: string }) => {
  const { projects, projectsFetchError, projectsIsLoading, mutateProjects } =
    useProjects();
  const router = useRouter();
  const { nameUpdated, teamId } = router.query;
  const errorToast = useToast();
  const baseRoute = useAppBaseRoute();
  const postErrorToast = (message: string) =>
    errorToast({
      title: "Unable to perform action",
      description: message,
      status: "error",
      duration: 9000,
      isClosable: true,
      variant: "solid",
      position: "top",
    });

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, touchedFields },
    watch,
    setError,
  } = useForm<{ project_id: string }>({
    defaultValues: { project_id: currentName },
  });

  const currentInput = watch("project_id");

  const onSubmit: SubmitHandler<{ project_id: string }> = async (data) => {
    const existingProjectIds = projects
      ? projects.map((project) => project.project_id)
      : [];
    if (existingProjectIds.findIndex((id) => id === data.project_id) !== -1) {
      setError(
        "project_id",
        { message: "Project with same name already exists" },
        { shouldFocus: true }
      );
      return;
    }

    await updateProject(
      {
        updateType: "project_id",
        newValue: data.project_id,
        originalId: currentName,
      },
      async () => {
        await mutateProjects();
        router.push(
          baseRoute +
            "/projects/" +
            data.project_id +
            "/settings?nameUpdated=true"
        );
      },
      postErrorToast,
      teamId as string
    );
  };

  return (
    <Box
      w="full"
      rounded="md"
      bg={useColorModeValue("white", "gray.950")}
      py="6"
      px="6"
    >
      <Heading as="h2" fontSize="2xl" fontWeight="medium">
        Project Name
      </Heading>
      <Text
        mt="10px"
        fontSize="lg"
        fontWeight="normal"
        color={useColorModeValue("gray.500", "whiteAlpha.500")}
      >
        Name used to identify this project. Must be unique within personal
        account or team.
      </Text>

      <chakra.form onSubmit={handleSubmit(onSubmit)}>
        <Flex alignItems="center" mt="1em" justifyContent="space-between">
          <InputGroup mr="10px">
            <InputLeftAddon children="komonitor.com/app/projects/" />
            <Input
              placeholder={"Project Name"}
              {...register("project_id", {
                required: "Project name is required.",
                maxLength: {
                  value: 50,
                  message: "Name must be 50 characters or under in length.",
                },
                pattern: {
                  value: /^[a-zA-Z0-9-_]+$/i,
                  message:
                    "Name must consist of alphanumeric characters, hyphens, and underscores.",
                },
              })}
            />
          </InputGroup>
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
              currentInput === currentName || errors.project_id !== undefined
            }
            letterSpacing="wider"
          >
            Save
          </Button>
        </Flex>
        <chakra.div color="red.400" mt="6px">
          {errors.project_id?.message}
        </chakra.div>
        {nameUpdated === "true" && currentName === currentInput && (
          <chakra.div borderRadius="md" color="green.400">
            Project name successfully updated.
          </chakra.div>
        )}
      </chakra.form>
    </Box>
  );
};

const DangerZone = ({ projectName }: { projectName: string }) => {
  const { cancelRef, isOpen, onClose, onOpen } = useDeleteProjectDialog();
  const router = useRouter();
  const { teamId } = router.query;
  return (
    <>
      <DeleteProjectDialog
        onClose={onClose}
        isOpen={isOpen}
        onError={() => {}}
        projectName={projectName}
        leastDestructiveRef={cancelRef}
        teamId={teamId as string}
      />
      <Box
        w="full"
        rounded="md"
        bg={useColorModeValue("white", "gray.950")}
        py="6"
        px="6"
        mt="6"
      >
        <Heading
          as="h2"
          fontSize="xl"
          fontWeight="medium"
          color="red.500"
          mb="6"
        >
          Danger Zone
        </Heading>
        <Button
          colorScheme="red"
          color="white"
          bgColor="red.500"
          shadow="sm"
          _hover={{
            bg: "red.600",
          }}
          fontWeight="normal"
          onClick={() => {
            onOpen();
          }}
        >
          Delete Project
        </Button>
      </Box>
    </>
  );
};

const Settings: ExtendedNextPage = () => {
  const router = useRouter();
  const { projectId } = router.query;
  const { projects, projectsIsLoading, projectsFetchError } = useProjects();
  const baseRoute = useAppBaseRoute();

  if (projects) {
    if (!projects.find((project) => project.project_id === projectId)) {
      router.push(baseRoute);
    }
  }

  return (
    <PageLayout isAppPage>
      <AppSubNav
        links={[
          {
            isSelected: false,
            href: baseRoute + "/projects/" + projectId,
            text: "Overview",
          },
          {
            isSelected: false,
            href: baseRoute + "/projects/" + projectId + "/uptime",
            text: "Uptime Monitors",
          },
          {
            isSelected: true,
            href: baseRoute + "/projects/" + projectId + "/settings",
            text: "Project Settings",
          },
        ]}
      />
      <Heading textAlign="left" fontWeight="medium" mb=".2em" fontSize="2xl">
        Projects Settings
      </Heading>
      <Heading
        textAlign="left"
        fontWeight="normal"
        mb="1em"
        fontSize="lg"
        color="gray.500"
      >
        Manage and edit project settings here.
      </Heading>
      <NameChangeForm currentName={projectId as string} />
      <DangerZone projectName={projectId as string} />
    </PageLayout>
  );
};

Settings.requiresAuth = true;
export default Settings;
