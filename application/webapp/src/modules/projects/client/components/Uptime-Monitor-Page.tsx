import {
  Box,
  Button,
  Fade,
  Flex,
  Heading,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import { ExtendedNextPage } from "../../../../../pages/_app";
import { AppSubNav } from "../../../../common/components/App-Sub-Nav";
import { LoadingSpinner } from "../../../../common/components/Loading-Spinner";
import { PageLayout } from "../../../../common/components/Page-Layout";
import { useTeam } from "../../../teams/client";
import {
  use24HourMonitorStatuses,
  useUptimeMonitorsForProject,
} from "../../../uptime/client";
import { CreateUpdateFormRewrite } from "../../../uptime/components/Create-Update-Form-Rewrite";
import { OverviewTable } from "../../../uptime/components/Overview-Table";
import { useUserServicePlanProductId } from "../../../user/client";
import { useProjects } from "../client";

const Page: ExtendedNextPage = () => {
  const router = useRouter();
  const { projectId, teamId, createMonitor } = router.query;

  const { isOpen: isCreateFormOpen, onToggle: toggleOpenCreateForm } =
    useDisclosure({ defaultIsOpen: createMonitor === "true" });

  const { projects, projectsIsLoading, projectsFetchError } = useProjects();
  const { team } = useTeam(teamId as string);
  const { monitors: data, isLoading: monitorsIsLoading } =
    useUptimeMonitorsForProject(projectId as string);
  const { data: plan } = useUserServicePlanProductId();

  const monitors = data ? data[projectId as string] : [];

  let {
    statuses,
    isLoading: statusesIsLoading,
    isError: statusesIsError,
  } = use24HourMonitorStatuses(
    monitors ? monitors.map((monitor) => monitor.monitor_id) : []
  );

  if (projects) {
    if (!projects.find((project) => project.project_id === projectId)) {
      router.push(team ? "/" + team : "/app");
    }
  }

  const noMonitorsForProject =
    !monitorsIsLoading && monitors && monitors.length === 0;

  const hasMonitors = !noMonitorsForProject;

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
            isSelected: true,
            href: "/app/projects/" + projectId + "/uptime",
            text: "Uptime Monitors",
          },
          {
            isSelected: false,
            href: "/app/projects/" + projectId + "/settings",
            text: "Project Settings",
          },
        ]}
      />
      <Flex justifyContent="space-between">
        {isCreateFormOpen ? (
          <Heading
            textAlign="left"
            fontWeight="medium"
            mb="20px"
            fontSize="2xl"
          >
            Create Uptime Monitor
            <Text fontSize="sm" color="gray.500">
              (fill out form below)
            </Text>
          </Heading>
        ) : (
          <Heading
            textAlign="left"
            fontWeight="medium"
            mb="20px"
            fontSize="2xl"
          >
            Uptime Monitors{" "}
            <Text fontSize="sm" color="gray.500">
              (Last 24 hours)
            </Text>
          </Heading>
        )}
        <Button
          size="lg"
          as="a"
          fontSize="lg"
          fontWeight="medium"
          px="1em"
          shadow="md"
          colorScheme="blue"
          bgColor={isCreateFormOpen ? "gray.400" : "blue.400"}
          color="white"
          _hover={{
            bg: isCreateFormOpen ? "gray.600" : "blue.600",
          }}
          onClick={() => toggleOpenCreateForm()}
        >
          {isCreateFormOpen ? "Cancel" : "+ Create a Monitor"}
        </Button>
      </Flex>
      {!isCreateFormOpen && (
        <>
          {monitorsIsLoading && <LoadingSpinner />}
          {hasMonitors && (
            <Fade in={!monitorsIsLoading}>
              <OverviewTable
                monitors={monitors ? monitors : []}
                statusesMap={statusesIsLoading ? {} : statuses}
              />
            </Fade>
          )}
          {noMonitorsForProject && (
            <Box>
              <Text fontSize="xl">
                No uptime monitors have been created for this project.
              </Text>
            </Box>
          )}
        </>
      )}
      {isCreateFormOpen && (
        <CreateUpdateFormRewrite
          product_id={plan ? plan.productId : ""}
          closeForm={toggleOpenCreateForm}
        />
      )}
    </PageLayout>
  );
};

Page.requiresAuth = true;
export default Page;
