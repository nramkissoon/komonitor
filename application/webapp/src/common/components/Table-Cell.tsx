import { IconButton } from "@chakra-ui/button";
import { DeleteIcon, EditIcon } from "@chakra-ui/icons";
import { Flex } from "@chakra-ui/layout";
import { Tooltip } from "@chakra-ui/react";
import router from "next/router";
import React from "react";
import { AiOutlineInfoCircle } from "react-icons/ai";

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
            router.push(baseItemUrl + cellValues.itemId);
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
            router.push(baseItemUrl + cellValues.itemId + "/edit");
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
