import { DeleteIcon } from "@chakra-ui/icons";
import {
  Badge,
  Box,
  Button,
  chakra,
  Flex,
  IconButton,
  Text,
  Tooltip,
  useColorModeValue,
} from "@chakra-ui/react";
import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";
import { AiOutlineInfoCircle } from "react-icons/ai";
import { toExternalUptimeStatusObject, UptimeMonitorStatus } from "utils";
import { getTimeString, useAppBaseRoute } from "../../../common/client-utils";

interface DescriptionCellProps {
  monitorId: string;
  name: string;
  url: string;
  region: string;
}

export function DescriptionCell(props: DescriptionCellProps) {
  const router = useRouter();
  const baseRoute = useAppBaseRoute();
  const { projectId } = router.query;
  return (
    <Box>
      <Tooltip label="Details">
        <Box w="fit-content">
          <Link
            passHref
            href={`${baseRoute}/projects/${projectId}/uptime/${props.monitorId}`}
          >
            <Box
              _hover={{
                cursor: "pointer",
                color: useColorModeValue("gray.400", "gray.500"),
              }}
              w="max-content"
            >
              <Text
                mb=".6em"
                fontSize="xl"
                fontWeight="normal"
                letterSpacing="normal"
              >
                {props.name}
              </Text>
              <Text fontWeight="normal">{props.url}</Text>
              <Text fontSize="sm">{props.region}</Text>
            </Box>
          </Link>
        </Box>
      </Tooltip>
    </Box>
  );
}

interface StatusCellProps {
  status: string;
}

export function StatusCell(props: StatusCellProps) {
  let color = "gray";
  if (props.status === "up") color = "green";
  if (props.status === "down") color = "red";
  if (props.status === "paused") color = "gray";
  return (
    <Badge
      variant="subtle"
      colorScheme={color}
      fontSize="sm"
      fontWeight="normal"
      py=".3em"
      px=".5em"
      borderRadius="md"
    >
      {props.status}
    </Badge>
  );
}

interface ResponseTimeCellProps {
  responseTime: number;
}

export function ResponseTimeCellProps(props: ResponseTimeCellProps) {
  const { responseTime } = props;
  if (responseTime === -1) return "No Response";
  return responseTime.toFixed(2) + "ms";
}

interface TimestampCellProps {
  timestamp: number;
  offset: number;
}

export function TimestampCell(props: TimestampCellProps) {
  const { timestamp, offset } = props;
  return (
    <chakra.span fontSize="sm">{getTimeString(offset, timestamp)}</chakra.span>
  );
}

interface ResponseCellProps {
  code: number;
  message?: string;
}

export function ResponseCell({ code, message }: ResponseCellProps) {
  return (
    <chakra.p fontSize="sm">
      {code}
      {message ? " " + message : null}
    </chakra.p>
  );
}

export function StatusObjectCell({
  status,
  setStatusToView,
  onOpen,
}: {
  status: UptimeMonitorStatus;
  setStatusToView: React.Dispatch<React.SetStateAction<object | undefined>>;
  onOpen: () => void;
}) {
  return (
    <Button
      aria-label="view monitor status JSON object"
      rightIcon={<AiOutlineInfoCircle />}
      variant="ghost"
      colorScheme="blue"
      onClick={() => {
        setStatusToView(toExternalUptimeStatusObject(status));
        onOpen();
      }}
      pl="0"
      fontWeight="normal"
      fontSize="sm"
    >
      View Full Status
    </Button>
  );
}

interface ActionsCellProps {
  cellValues: {
    monitorId: string;
    name: string;
  };
  openDeleteDialog: Function;
}

export function ActionsCell(props: ActionsCellProps) {
  const router = useRouter();
  const baseRoute = useAppBaseRoute();
  const { projectId } = router.query;
  return (
    <Flex justifyContent="flex-start">
      <Tooltip label="Details">
        <IconButton
          aria-label="view monitor details"
          icon={<AiOutlineInfoCircle />}
          colorScheme="gray"
          color="white"
          bgColor="gray.500"
          mr="1.3em"
          onClick={() => {
            router.push(
              `${baseRoute}/projects/${projectId}/uptime/` +
                props.cellValues.monitorId
            );
          }}
          _hover={{
            bg: "gray.600",
          }}
        />
      </Tooltip>
      <Tooltip label="Delete">
        <IconButton
          aria-label="delete monitor"
          icon={<DeleteIcon />}
          colorScheme="red"
          onClick={() => {
            props.openDeleteDialog(
              props.cellValues.name,
              props.cellValues.monitorId
            );
          }}
          color="white"
          bgColor="red.500"
          _hover={{
            bg: "red.600",
          }}
        />
      </Tooltip>
    </Flex>
  );
}
