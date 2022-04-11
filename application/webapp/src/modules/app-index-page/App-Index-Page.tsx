import { ExternalLinkIcon, SearchIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  chakra,
  Divider,
  Flex,
  Grid,
  GridItem,
  Heading,
  Input,
  InputGroup,
  InputLeftElement,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import Fuse from "fuse.js";
import Link from "next/link";
import React from "react";
import { Project, UptimeMonitor } from "utils";
import { timeAgo, useAppBaseRoute } from "../../common/client-utils";
import { AppSubNav } from "../../common/components/App-Sub-Nav";
import { LoadingSpinner } from "../../common/components/Loading-Spinner";
import { useProjects } from "../projects/client/client";
import { CreateForm } from "../projects/client/components/Create-Form";
import { useMonitorsAnd24HrStatusesForAllOwnerProjects } from "../uptime/client";

const ProjectsGrid: React.FC<{}> = (props) => (
  <Grid
    templateColumns={[
      "repeat(1, 1fr)",
      "repeat(2, 1fr)",
      null,
      "repeat(4, 1fr)",
    ]}
    gap={6}
    my="5"
  >
    {props.children}
  </Grid>
);

const ProjectCard = ({
  project,
  uptimeMonitors,
}: {
  project: Project;
  uptimeMonitors: UptimeMonitor[];
}) => {
  const baseRoute = useAppBaseRoute();
  return (
    <GridItem colSpan={1}>
      <Link href={baseRoute + "/projects/" + project.project_id} passHref>
        <Box
          bg={useColorModeValue("white", "gray.950")}
          p="5"
          position="relative"
          rounded="lg"
          border="1px"
          borderColor={useColorModeValue("gray.300", "whiteAlpha.300")}
          transitionDuration=".3s"
          _hover={{
            border: "1px solid",
            borderColor: "blue.300",
            cursor: "pointer",
          }}
          role="group"
        >
          <Box
            position="absolute"
            top="-4"
            right="-4"
            bg={useColorModeValue("blue.300", "gray.700")}
            rounded="full"
            p="2"
            visibility="hidden"
            _groupHover={{ visibility: "visible" }}
          >
            <ExternalLinkIcon
              boxSize={6}
              color={useColorModeValue("gray.50", "blue.300")}
            />
          </Box>
          <Heading as="h2" fontSize="xl" fontWeight="medium">
            {project.project_id}
          </Heading>
          <Text color="gray.500">
            Created {timeAgo.format(project.created_at)}
          </Text>
          <Divider />
          <Text mt="10px">Total uptime monitors: {uptimeMonitors.length}</Text>
        </Box>
      </Link>
    </GridItem>
  );
};

const ProjectsTab = () => {
  const [newProjectFormVisible, setNewProjectFormVisible] =
    React.useState(false);

  const { projects, projectsFetchError, projectsIsLoading, mutateProjects } =
    useProjects();
  const { monitors } = useMonitorsAnd24HrStatusesForAllOwnerProjects();

  const [searchQuery, setSearchQuery] = React.useState("");
  const fuse = new Fuse(projects ?? [], { keys: ["project_id"] });
  const results = fuse.search(searchQuery);
  return (
    <Flex flexDir="column" maxW="full" margin="auto">
      <Heading textAlign="left" fontWeight="medium" mb=".2em" fontSize="3xl">
        Projects
      </Heading>
      <Heading
        textAlign="left"
        fontWeight="normal"
        mb="1em"
        fontSize="xl"
        color="gray.500"
      >
        Use projects to logically group and organize your monitors.
      </Heading>
      <Flex>
        <InputGroup mr="1em">
          <InputLeftElement
            pointerEvents="none"
            children={<SearchIcon color="gray.300" />}
          />
          <Input
            shadow="sm"
            placeholder="Search projects..."
            background={useColorModeValue("white", "gray.950")}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </InputGroup>
        <Button
          fontWeight="normal"
          px="6"
          fontSize="lg"
          shadow="sm"
          colorScheme="blue"
          bgColor="blue.400"
          color="white"
          _hover={{
            bg: "blue.600",
          }}
          onClick={() => setNewProjectFormVisible(true)}
        >
          New Project
        </Button>
      </Flex>
      <Box mt="4" w="full" hidden={!newProjectFormVisible}>
        <CreateForm setIsVisible={setNewProjectFormVisible} />
        <Divider
          borderColor={useColorModeValue("gray.300", "whiteAlpha.300")}
          mt="4"
          mb="2"
        />
      </Box>
      {projectsIsLoading && <LoadingSpinner />}
      {!projectsIsLoading && projects && projects.length === 0 && (
        <Box textAlign="center" fontWeight="medium" p="2em" fontSize="3xl">
          <chakra.p>No projects have been created.</chakra.p>
          <chakra.span fontWeight="normal" fontSize="2xl" color="blue.400">
            Create a new project to get started.
          </chakra.span>
        </Box>
      )}
      {!projectsIsLoading && projects && projects.length > 0 && (
        <ProjectsGrid>
          {searchQuery
            ? results.map((project) => (
                <ProjectCard
                  key={project.item.project_id}
                  project={project.item}
                  uptimeMonitors={
                    monitors ? monitors[project.item.project_id] ?? [] : []
                  }
                />
              ))
            : projects.map((project) => (
                <ProjectCard
                  key={project.project_id}
                  project={project}
                  uptimeMonitors={
                    monitors ? monitors[project.project_id] ?? [] : []
                  }
                />
              ))}
        </ProjectsGrid>
      )}
    </Flex>
  );
};

export function AppIndexPage() {
  const baseRoute = useAppBaseRoute();
  return (
    <>
      <AppSubNav
        links={[
          { isSelected: true, href: baseRoute, text: "Projects" },
          {
            isSelected: false,
            href: baseRoute + "/integrations",
            text: "Integrations",
          },
          {
            isSelected: false,
            href: baseRoute + "/settings",
            text: "Settings",
          },
        ]}
      />

      <ProjectsTab />
    </>
  );
}
