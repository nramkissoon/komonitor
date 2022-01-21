import { ExternalLinkIcon, SearchIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  chakra,
  Flex,
  Grid,
  GridItem,
  Heading,
  Input,
  InputGroup,
  InputLeftElement,
  useColorModeValue,
} from "@chakra-ui/react";
import Fuse from "fuse.js";
import Link from "next/link";
import { Project } from "project-types";
import React from "react";
import { AppSubNav } from "../../common/components/App-Sub-Nav";

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

const ProjectCard = ({ project }: { project: Project }) => {
  return (
    <GridItem colSpan={1}>
      <Link href={"/app/projects/" + project.project_id} passHref>
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
        </Box>
      </Link>
    </GridItem>
  );
};

const ProjectsTab = () => {
  const projects: Project[] = [
    {
      project_id: "Test-Project",
      uptime_monitors: [],
      owner_id: "asd",
      created_at: 0,
      updated_at: 230,
    },
    {
      project_id: "Test-Project2",
      uptime_monitors: [],
      owner_id: "asd",
      created_at: 0,
      updated_at: 230,
    },
    {
      project_id: "Test-Project3",
      uptime_monitors: [],
      owner_id: "asd",
      created_at: 0,
      updated_at: 230,
    },
    {
      project_id: "Test-Project4",
      uptime_monitors: [],
      owner_id: "asd",
      created_at: 0,
      updated_at: 230,
    },
  ];

  const [searchQuery, setSearchQuery] = React.useState("");
  const fuse = new Fuse(projects, { keys: ["project_id"] });
  const results = fuse.search(searchQuery);
  return (
    <Flex flexDir="column" maxW="6xl" margin="auto">
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
        <Link passHref href="/app/projects/new">
          <Button
            fontWeight="normal"
            px="6"
            as="a"
            fontSize="lg"
            shadow="sm"
            colorScheme="blue"
            bgColor="blue.400"
            color="white"
            _hover={{
              bg: "blue.600",
            }}
          >
            New Project
          </Button>
        </Link>
      </Flex>
      {projects.length === 0 && (
        <Box textAlign="center" fontWeight="medium" p="2em" fontSize="3xl">
          <chakra.p>No projects have been created.</chakra.p>
          <Link passHref href="/app/projects/new">
            <chakra.a
              fontWeight="normal"
              fontSize="2xl"
              color={useColorModeValue("blue.400", "blue.300")}
              _hover={{
                color: "blue.600",
              }}
            >
              Create a new project to get started.
            </chakra.a>
          </Link>
        </Box>
      )}
      {projects.length > 0 && (
        <ProjectsGrid>
          {searchQuery
            ? results.map((project) => (
                <ProjectCard
                  key={project.item.project_id}
                  project={project.item}
                />
              ))
            : projects.map((project) => (
                <ProjectCard key={project.project_id} project={project} />
              ))}
        </ProjectsGrid>
      )}
    </Flex>
  );
};

export function AppIndexPage() {
  return (
    <>
      <AppSubNav
        links={[
          { isSelected: true, href: "/app", text: "Projects" },
          {
            isSelected: false,
            href: "/app/integrations",
            text: "Integrations",
          },
          { isSelected: false, href: "/app/settings", text: "Settings" },
        ]}
      />

      <ProjectsTab />
    </>
  );
}
