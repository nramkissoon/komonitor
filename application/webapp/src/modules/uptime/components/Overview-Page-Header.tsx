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
  useColorModeValue,
} from "@chakra-ui/react";
import NextLink from "next/link";
import { useRouter } from "next/router";
import React from "react";
import { AiOutlinePause, AiOutlinePlaySquare } from "react-icons/ai";
import { UptimeMonitor } from "utils";
import { timeAgo } from "../../../common/client-utils";
import { togglePauseMonitor } from "../client";

interface OverviewPageHeaderProps {
  monitorName: string;
  monitorUrl: string;
  currentStatus: string | null | undefined;
  lastChecked: number | null | undefined;
  monitorId: string;
  monitorRegion: string;
  openDeleteDialog: Function;
  openEditForm: () => void;
  monitor: UptimeMonitor;
  mutate: any;
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
    openEditForm,
    monitor,
    mutate,
  } = props;
  const router = useRouter();
  const { projectId } = router.query;
  let color = "gray";
  const [paused, setIsPaused] = React.useState(monitor.paused);
  if (currentStatus === "up") color = "green";
  if (currentStatus === "down") color = "red";
  if (paused) color = "gray";
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
        <Flex flexDir={["column", null, null, "row"]}>
          <Badge
            variant="subtle"
            colorScheme={color}
            fontSize="md"
            fontWeight="normal"
            py=".1em"
            px=".6em"
            borderRadius="md"
            w="fit-content"
            mr="5px"
          >
            {paused ? "Paused" : currentStatus ? currentStatus : "Pending"}
          </Badge>
          <Text py=".1em">
            {lastChecked
              ? "Last checked " +
                timeAgo.format(now - (now - lastChecked)) +
                " from " +
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
          variant="ghost"
          _hover={{
            color: useColorModeValue("blue.600", "blue.300"),
          }}
          fontWeight="normal"
          onClick={() => {
            router.push("/app/projects/" + projectId + "/uptime");
          }}
        >
          Back to all monitors
        </Button>
        <Button
          leftIcon={paused ? <AiOutlinePlaySquare /> : <AiOutlinePause />}
          colorScheme="gray"
          color="white"
          bgColor="gray.500"
          shadow="sm"
          _hover={{
            bg: "gray.600",
          }}
          fontWeight="normal"
          onClick={async () => {
            await togglePauseMonitor(
              monitor,
              () => {
                setIsPaused(!paused);
              },
              () => {}
            );
            await mutate();
          }}
        >
          {paused ? "Resume" : "Pause"}
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
          onClick={openEditForm}
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
