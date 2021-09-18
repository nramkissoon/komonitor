import { DeleteIcon, EditIcon } from "@chakra-ui/icons";
import {
  Box,
  Flex,
  IconButton,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import Link from "next/link";
import router from "next/router";
import React from "react";

interface DescriptionCellProps {
  monitorId: string;
  name: string;
  url: string;
}

export function DescriptionCell(props: DescriptionCellProps) {
  return (
    <Box>
      <Link passHref href={`/app/uptime/${props.monitorId}`}>
        <Box
          _hover={{
            cursor: "pointer",
            color: useColorModeValue("green.400", "green.300"),
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
      <IconButton
        aria-label="edit monitor"
        icon={<EditIcon />}
        colorScheme="blue"
        color="white"
        bgColor="blue.500"
        mr="1.8em"
        onClick={() => {
          router.push("/app/uptime/" + props.cellValues.monitorId + "/edit");
        }}
      />
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
    </Flex>
  );
}
