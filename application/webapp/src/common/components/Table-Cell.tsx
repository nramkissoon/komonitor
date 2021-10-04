import { IconButton } from "@chakra-ui/button";
import { DeleteIcon, EditIcon } from "@chakra-ui/icons";
import { Badge, Box, Flex } from "@chakra-ui/layout";
import { Text, Tooltip, useColorModeValue } from "@chakra-ui/react";
import Link from "next/link";
import router from "next/router";
import { AlertSeverities } from "project-types";
import React from "react";
import { AiOutlineInfoCircle } from "react-icons/ai";
import { getItemBaseUrlFromItemId } from "../utils";

interface ActionsCellProps {
  cellValues: {
    itemId: string;
    itemName: string;
  };
  openDeleteDialog: (item: { name: string; id: string }) => void;
  itemType: string;
  baseItemUrl: string;
}

export function ActionsCell(props: ActionsCellProps) {
  const { cellValues, openDeleteDialog, itemType, baseItemUrl } = props;

  return (
    <Flex justifyContent="flex-start">
      <Tooltip label="Details">
        <IconButton
          aria-label={`view ${itemType} details`}
          icon={<AiOutlineInfoCircle />}
          colorScheme="gray"
          color="white"
          bgColor="gray.500"
          mr="1.3em"
          onClick={() => {
            router.push(baseItemUrl + "/" + cellValues.itemId);
          }}
          _hover={{
            bg: "gray.600",
          }}
        />
      </Tooltip>
      <Tooltip label="Edit">
        <IconButton
          aria-label={`edit ${itemType}`}
          icon={<EditIcon />}
          colorScheme="blue"
          color="white"
          bgColor="blue.500"
          mr="1.3em"
          onClick={() => {
            router.push(baseItemUrl + "/" + cellValues.itemId + "/edit");
          }}
          _hover={{
            bg: "blue.600",
          }}
        />
      </Tooltip>
      <Tooltip label="Delete">
        <IconButton
          aria-label={`delete ${itemType}`}
          icon={<DeleteIcon />}
          colorScheme="red"
          onClick={() => {
            openDeleteDialog({
              name: cellValues.itemName,
              id: cellValues.itemId,
            });
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

interface SimpleTimestampCellProps {
  timestamp: number;
}

export function SimpleTimestampCell(props: SimpleTimestampCellProps) {
  return <>{new Date(props.timestamp).toUTCString()}</>;
}

interface AlertSeverityCellProps {
  severity: AlertSeverities;
}

export function AlertSeverityCell(props: AlertSeverityCellProps) {
  const { severity } = props;

  let colorScheme = "gray";
  switch (severity) {
    case "Critical":
      colorScheme = "red";
      break;
    case "Severe":
      colorScheme = "orange";
      break;
    case "Warning":
      colorScheme = "yellow";
      break;
    default:
      break;
  }

  return (
    <Badge
      variant="subtle"
      colorScheme={colorScheme}
      fontSize="md"
      fontWeight="normal"
      py=".5em"
      px=".8em"
      borderRadius="md"
      letterSpacing="wider"
      size="md"
    >
      {severity}
    </Badge>
  );
}

interface AlertRecipientsCellProps {
  recipients: string[];
}

export function AlertRecipientsCell(props: AlertRecipientsCellProps) {
  const { recipients } = props;

  return (
    <Box>
      {recipients.map((recip) => (
        <Text>{recip}</Text>
      ))}
    </Box>
  );
}

interface GenericMonitorNameCellProps {
  name: string;
  id: string;
}

export function GenericMonitorNameCell(props: GenericMonitorNameCellProps) {
  const { name, id } = props;

  return (
    <Box>
      <Tooltip label="Details">
        <Box w="fit-content">
          <Link passHref href={getItemBaseUrlFromItemId(id) + id}>
            <Box
              _hover={{
                cursor: "pointer",
                color: useColorModeValue("gray.400", "gray.500"),
              }}
              w="max-content"
            >
              <Text fontSize="xl" fontWeight="normal" letterSpacing="normal">
                {name}
              </Text>
            </Box>
          </Link>
        </Box>
      </Tooltip>
    </Box>
  );
}
