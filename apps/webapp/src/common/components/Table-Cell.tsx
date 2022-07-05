import { IconButton } from "@chakra-ui/button";
import { DeleteIcon, EditIcon, WarningIcon } from "@chakra-ui/icons";
import { Box, Flex } from "@chakra-ui/layout";
import { chakra, Text, Tooltip, useColorModeValue } from "@chakra-ui/react";
import Link from "next/link";
import router from "next/router";
import { AiOutlineInfoCircle } from "react-icons/ai";
import { getTimeString } from "../client-utils";
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
  offset: number;
  timestampAndOngoing: {
    timestamp: number;
    ongoing: boolean;
  };
}

export function SimpleTimestampCell(props: SimpleTimestampCellProps) {
  return (
    <Flex flexDir={["column", null, null, "row"]}>
      <chakra.p fontWeight="normal" mr=".5em" fontSize="sm">
        {getTimeString(props.offset, props.timestampAndOngoing.timestamp)}
      </chakra.p>

      {props.timestampAndOngoing.ongoing && (
        <Tooltip label="Alert is ongoing">
          <WarningIcon color="red.500" />
        </Tooltip>
      )}
    </Flex>
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
