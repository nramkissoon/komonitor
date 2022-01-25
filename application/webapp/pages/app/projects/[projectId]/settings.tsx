import {
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
  useToast,
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import React from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { AppSubNav } from "../../../../src/common/components/App-Sub-Nav";
import { PageLayout } from "../../../../src/common/components/Page-Layout";
import { useTeam } from "../../../../src/common/components/TeamProvider";
import {
  updateProject,
  useProjects,
} from "../../../../src/modules/projects/client/client";
import { ExtendedNextPage } from "../../../_app";

const NameChangeForm = ({ currentName }: { currentName: string }) => {
  const { projects, projectsFetchError, projectsIsLoading, mutateProjects } =
    useProjects();
  const router = useRouter();
  const { nameUpdated } = router.query;
  const errorToast = useToast();
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
          "/app/projects/" + data.project_id + "/settings?nameUpdated=true"
        );
      },
      postErrorToast
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

const DangerZone = () => {
  return (
    <Box
      w="full"
      rounded="md"
      bg={useColorModeValue("white", "gray.950")}
      py="6"
      px="6"
      mt="6"
    >
      <Heading as="h2" fontSize="xl" fontWeight="medium" color="red.500" mb="6">
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
          //openDeleteDialog({ name: monitorName, id: monitorId });
        }}
      >
        Delete Project
      </Button>
    </Box>
  );
};

const Overview: ExtendedNextPage = () => {
  const router = useRouter();
  const { projectId } = router.query;
  const { projects, projectsIsLoading, projectsFetchError } = useProjects();
  const { team } = useTeam();

  if (projects) {
    if (!projects.find((project) => project.project_id === projectId)) {
      router.push(team ? "/" + team : "/app");
    }
  }

  return (
    <PageLayout isAppPage>
      <AppSubNav
        links={[
          {
            isSelected: false,
            href: "/app/projects/" + projectId,
            text: "Overview",
          },
          {
            isSelected: false,
            href: "/app/projects/" + projectId + "/uptime",
            text: "Uptime Monitors",
          },
          {
            isSelected: true,
            href: "/app/projects/" + projectId + "/settings",
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
      <DangerZone />
    </PageLayout>
  );
};

Overview.requiresAuth = true;
export default Overview;
