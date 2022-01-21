import { SearchIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  chakra,
  Flex,
  Input,
  InputGroup,
  InputLeftElement,
  useColorModeValue,
} from "@chakra-ui/react";
import Link from "next/link";
import { AppSubNav } from "../../common/components/App-Sub-Nav";

const ProjectsTab = () => {
  const projects = [];
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
    </Flex>
  );
};

export function AppIndexPage() {
  return (
    <>
      <AppSubNav
        links={[
          { isSelected: true, href: "/app", text: "Projects" },
          { isSelected: false, href: "/app/settings", text: "Settings" },
        ]}
      />

      <ProjectsTab />
    </>
  );
}
