import { ArrowBackIcon, DeleteIcon, EditIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  Flex,
  Heading,
  Spacer,
  Stack,
  Text,
} from "@chakra-ui/react";
import router from "next/router";
import { AlertTypes } from "project-types";
import React from "react";
import { timeAgo } from "../../../common/client-utils";
import { alertTypeToBadge } from "./Alert-Type-Badges";

interface OverviewPageHeaderProps {
  name: string;
  createdAt: number;
  id: string;
  type: string;
  openDeleteDialog: Function;
}

export function OverviewPageHeader(props: OverviewPageHeaderProps) {
  const { name, createdAt, id, type, openDeleteDialog } = props;

  return (
    <Flex mb="1em">
      <Box>
        <Heading>{name}</Heading>
        <Text color="gray.500">Created {timeAgo.format(createdAt)}</Text>
        {alertTypeToBadge(type as AlertTypes)}
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
            router.push("/app/alerts/");
          }}
        >
          Back to all alerts
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
          onClick={() => router.push("/app/alerts/" + id + "/edit")}
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
            openDeleteDialog({ name: name, id: id });
          }}
        >
          Delete
        </Button>
      </Stack>
    </Flex>
  );
}
