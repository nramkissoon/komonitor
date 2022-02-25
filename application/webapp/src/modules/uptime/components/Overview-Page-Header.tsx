import {
  ArrowBackIcon,
  DeleteIcon,
  EditIcon,
  ExternalLinkIcon,
} from "@chakra-ui/icons";
import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  Badge,
  Box,
  Button,
  chakra,
  Flex,
  Heading,
  Link,
  Spacer,
  Stack,
  Text,
  useColorModeValue,
  useDisclosure,
} from "@chakra-ui/react";
import { noop } from "lodash";
import NextLink from "next/link";
import { useRouter } from "next/router";
import React, { RefObject } from "react";
import { AiOutlinePause, AiOutlinePlaySquare } from "react-icons/ai";
import { UptimeMonitor } from "utils";
import { timeAgo, useAppBaseRoute } from "../../../common/client-utils";
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

interface MonitorPauseDialogProps {
  isOpen: boolean;
  onClose: () => void;
  leastDestructiveRef: RefObject<any>;
  mutate: any;
  monitor: UptimeMonitor;
  setIsPaused: React.Dispatch<React.SetStateAction<boolean | undefined>>;
}

export function MonitorPauseDialog({
  isOpen,
  onClose,
  leastDestructiveRef,
  monitor,
  mutate,
  setIsPaused,
}: MonitorPauseDialogProps) {
  return (
    <AlertDialog
      leastDestructiveRef={leastDestructiveRef}
      isOpen={isOpen}
      onClose={onClose}
    >
      <AlertDialogContent>
        <AlertDialogHeader fontSize="2xl" fontWeight="normal">
          Pause Uptime Monitor
        </AlertDialogHeader>
        <AlertDialogBody>
          Are you sure?{" "}
          <chakra.span color="blue.400" fontSize="lg" fontWeight="semibold">
            {monitor.name}
          </chakra.span>{" "}
          monitor will be paused. You will not receive any alerts while this
          monitor is paused.
        </AlertDialogBody>
        <AlertDialogFooter>
          <Button
            ref={leastDestructiveRef}
            onClick={onClose}
            mr="1.5em"
            fontWeight="normal"
          >
            Cancel
          </Button>
          <Button
            leftIcon={<AiOutlinePause />}
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
                  setIsPaused(true);
                },
                () => {}
              );
              await mutate();
              onClose();
            }}
          >
            {"Pause"}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
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
  const baseRoute = useAppBaseRoute();
  const [paused, setIsPaused] = React.useState(monitor.paused);
  const cancelRef = React.useRef(true);
  const { isOpen, onClose, onOpen } = useDisclosure();
  const { projectId } = router.query;
  let color = "gray";

  if (currentStatus === "up") color = "green";
  if (currentStatus === "down") color = "red";
  if (paused) color = "gray";
  const now = Date.now();
  return (
    <Flex mb="1em">
      <MonitorPauseDialog
        onClose={onClose}
        isOpen={isOpen}
        leastDestructiveRef={cancelRef}
        setIsPaused={setIsPaused}
        monitor={monitor}
        mutate={mutate}
      />
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
            router.push(baseRoute + "/projects/" + projectId + "/uptime");
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
            if (paused) {
              await togglePauseMonitor(
                monitor,
                () => {
                  setIsPaused(false);
                },
                noop
              );
              await mutate();
            } else {
              onOpen();
            }
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
