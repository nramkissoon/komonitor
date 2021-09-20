import { DeleteIcon, EditIcon } from "@chakra-ui/icons";
import {
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
}

export function DescriptionCell(props: DescriptionCellProps) {
  return (
    <Box>
      <Link passHref href={`/app/uptime/${props.monitorId}`}>
        <Tooltip label="Details" openDelay={300}>
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
          </Box>
        </Tooltip>
      </Link>
    </Box>
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
      <Tooltip label="Details" openDelay={300}>
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
        />
      </Tooltip>
      <Tooltip label="Edit" openDelay={300}>
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
        />
      </Tooltip>
      <Tooltip label="Delete" openDelay={300}>
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
        />
      </Tooltip>
    </Flex>
  );
}
