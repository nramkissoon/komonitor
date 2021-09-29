import {
  ArrowBackIcon,
  DeleteIcon,
  EditIcon,
  ExternalLinkIcon,
} from "@chakra-ui/icons";
import {
  Badge,
  Box,
  Button,
  Flex,
  Heading,
  Link,
  Spacer,
  Stack,
  Text,
} from "@chakra-ui/react";
import NextLink from "next/link";
import router from "next/router";
import React from "react";
import { timeAgo } from "../../../common/client-utils";

interface OverviewPageHeaderProps {
  monitorName: string;
  monitorUrl: string;
  currentStatus: string | null | undefined;
  lastChecked: number | null | undefined;
  monitorId: string;
  monitorRegion: string;
  openDeleteDialog: Function;
}

// Header that contains the name of the monitor + other attributes + some actions
export function OverviewPageHeader(props: OverviewPageHeaderProps) {
  const {
    monitorName,
    monitorUrl,
    currentStatus,
    lastChecked,
    monitorId,
    openDeleteDialog,
    monitorRegion,
  } = props;
  let color = "gray";
  if (currentStatus === "up") color = "green";
  if (currentStatus === "down") color = "red";
  const now = Date.now();
  return (
    <Flex mb="1em">
      <Box w="fit-content">
        <Heading>{monitorName}</Heading>
        <Link as={NextLink} href={monitorUrl} isExternal>
          <Box _hover={{ cursor: "pointer", color: "gray.500" }}>
            {monitorUrl} <ExternalLinkIcon />
          </Box>
        </Link>
        <Flex>
          <Badge
            variant="subtle"
            colorScheme={color}
            fontSize="md"
            fontWeight="normal"
            py=".1em"
            px=".6em"
            borderRadius="md"
          >
            {currentStatus ? currentStatus : "No Data"}
          </Badge>
          <Text py=".1em" px=".6em">
            {lastChecked
              ? "Last checked " +
                timeAgo.format(now - (now - lastChecked)) +
                "from " +
                monitorRegion
              : ""}
          </Text>
        </Flex>
      </Box>
      <Spacer />
      <Stack direction={["column", null, "row"]} spacing={4}>
        <Button
          leftIcon={<ArrowBackIcon />}
          colorScheme="gray"
          color="white"
          bgColor="gray.500"
          shadow="sm"
          _hover={{
            bg: "gray.600",
          }}
          fontWeight="normal"
          onClick={() => {
            router.push("/app/uptime/");
          }}
        >
          Back to all monitors
        </Button>
        <Button
          leftIcon={<EditIcon />}
          colorScheme="blue"
          color="white"
          bgColor="blue.500"
          shadow="sm"
          _hover={{
            bg: "blue.600",
          }}
          fontWeight="normal"
          onClick={() => router.push("/app/uptime/" + monitorId + "/edit")}
        >
          Edit
        </Button>
        <Button
          leftIcon={<DeleteIcon />}
          colorScheme="red"
          color="white"
          bgColor="red.500"
          shadow="sm"
          _hover={{
            bg: "red.600",
          }}
          fontWeight="normal"
          onClick={() => {
            openDeleteDialog({ name: monitorName, id: monitorId });
          }}
        >
          Delete
        </Button>
      </Stack>
    </Flex>
  );
}
