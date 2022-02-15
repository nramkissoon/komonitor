import {
  Button,
  chakra,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  useColorModeValue,
  useToast,
} from "@chakra-ui/react";
import Router from "next/router";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { Project } from "utils";
import { createProject, useProjects } from "../client";

export type Inputs = Project;

export const CreateForm = ({
  setIsVisible,
}: {
  setIsVisible: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const { projects, projectsFetchError, projectsIsLoading, mutateProjects } =
    useProjects();
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
    watch,
    formState: { errors, isSubmitting, touchedFields },
    control,
    setValue,
    resetField,
    reset,
    getValues,
    clearErrors,
    setError,
  } = useForm<Inputs>({
    defaultValues: {
      created_at: 0,
      updated_at: 0,
      project_id: "",
      tags: [],
      owner_id: "",
    },
  });

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
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

    await createProject(
      data,
      async () => {
        await mutateProjects();
        Router.push("/app/projects/" + data.project_id);
      },
      postErrorToast
    );
  };

  return (
    <Flex py="3" pb="4" w="full">
      <chakra.form w="xl" onSubmit={handleSubmit(onSubmit)}>
        <Controller
          control={control}
          name="project_id"
          rules={{
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
          }}
          render={({ field }) => (
            <FormControl
              isInvalid={errors.project_id ? touchedFields.project_id : false}
              isRequired
              mb="1em"
            >
              <FormLabel htmlFor="name">Project Name</FormLabel>
              <Input
                {...field}
                background={useColorModeValue("white", "gray.950")}
                id="name"
                placeholder="Project Name"
              />
              <FormErrorMessage>{errors.project_id?.message}</FormErrorMessage>
            </FormControl>
          )}
        />
        <Button
          size="md"
          colorScheme="gray"
          bg="gray.400"
          color="white"
          fontSize="md"
          shadow="sm"
          fontWeight="medium"
          onClick={() => setIsVisible(false)}
          _hover={{ bg: "gray.500" }}
          mr="1.4em"
        >
          Cancel
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
          fontWeight="medium"
          _hover={{ bg: "blue.600" }}
        >
          Create
        </Button>
      </chakra.form>
    </Flex>
  );
};
