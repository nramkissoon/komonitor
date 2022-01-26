import { ArrowBackIcon } from "@chakra-ui/icons";
import { Link, useColorModeValue } from "@chakra-ui/react";
import NextLink from "next/link";
import { useRouter } from "next/router";
import React from "react";
import { AppSubNav } from "../../../../src/common/components/App-Sub-Nav";
import { PageLayout } from "../../../../src/common/components/Page-Layout";
import { useTeam } from "../../../../src/common/components/TeamProvider";
import { useProjects } from "../../../../src/modules/projects/client/client";
import { useUptimeMonitorsForProject } from "../../../../src/modules/uptime/client";
import { ExtendedNextPage } from "../../../_app";

const Overview: ExtendedNextPage = () => {
  const router = useRouter();
  const { projectId } = router.query;
  const { projects, projectsIsLoading, projectsFetchError } = useProjects();
  const { team } = useTeam();
  const { monitors: data } = useUptimeMonitorsForProject(projectId as string);

  const monitors = data ? data[projectId as string] : [];

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
            isSelected: true,
            href: "/app/projects/" + projectId,
            text: "Overview",
          },
          {
            isSelected: false,
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
      <NextLink href={team ? "/" + team : "/app"} passHref>
        <Link
          p="0"
          bg="none"
          color={useColorModeValue("gray.400", "gray.500")}
          _hover={{ color: "blue.600" }}
          display="flex"
          w="fit-content"
          alignItems="center"
        >
          <ArrowBackIcon /> Return to project dashboard
        </Link>
      </NextLink>
    </PageLayout>
  );
};

Overview.requiresAuth = true;
export default Overview;
