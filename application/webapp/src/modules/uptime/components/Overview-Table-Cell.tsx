import { DeleteIcon, EditIcon } from "@chakra-ui/icons";
import {
  Badge,
  Box,
  Flex,
  IconButton,
  Text,
  Tooltip,
  useColorModeValue,
} from "@chakra-ui/react";
import Link from "next/link";
import router from "next/router";
import React from "react";
import { AiOutlineInfoCircle } from "react-icons/ai";

interface DescriptionCellProps {
  monitorId: string;
  name: string;
  url: string;
  region: string;
}

export function DescriptionCell(props: DescriptionCellProps) {
  return (
    <Box>
      <Tooltip label="Details">
        <Box w="fit-content">
          <Link passHref href={`/app/uptime/${props.monitorId}`}>
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
              <Text fontWeight="thin">{props.url}</Text>
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
  let color = "yellow";
  if (props.status === "up") color = "green";
  if (props.status === "down") color = "red";
  return (
    <Badge
      variant="subtle"
      colorScheme={color}
      fontSize="lg"
      fontWeight="normal"
      py=".5em"
      px=".8em"
      borderRadius="lg"
    >
      {props.status}
    </Badge>
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
            router.push("/app/uptime/" + props.cellValues.monitorId);
          }}
          _hover={{
            bg: "gray.600",
          }}
        />
      </Tooltip>
      <Tooltip label="Edit">
        <IconButton
          aria-label="edit monitor"
          icon={<EditIcon />}
          colorScheme="blue"
          color="white"
          bgColor="blue.500"
          mr="1.3em"
          onClick={() => {
            router.push("/app/uptime/" + props.cellValues.monitorId + "/edit");
          }}
          _hover={{
            bg: "blue.600",
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
