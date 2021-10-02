import { Badge, Box, Flex } from "@chakra-ui/layout";
import { Text, useColorModeValue } from "@chakra-ui/react";
import { Tooltip } from "@chakra-ui/tooltip";
import Link from "next/link";
import { AlertStates, AlertTypes } from "project-types";
import React from "react";
import { alertTypeToBadge } from "./Alert-Type-Badges";

interface AlertStateCellProps {
  state: AlertStates;
}

export function AlertStateCell(props: AlertStateCellProps) {
  const { state } = props;

  let colorScheme = "green";
  switch (state) {
    case "disabled":
      colorScheme = "gray";
  }

  return (
    <Badge
      variant="subtle"
      colorScheme={colorScheme}
      fontSize="md"
      fontWeight="normal"
      py=".5em"
      px=".8em"
      borderRadius="lg"
      letterSpacing="wider"
      size="md"
    >
      {state}
    </Badge>
  );
}

interface AlertNameAndTypeCellProps {
  name: string;
  id: string;
  type: AlertTypes;
}

export function AlertNameAndTypeCell(props: AlertNameAndTypeCellProps) {
  const { name, id, type } = props;

  let typeComponent = alertTypeToBadge(type as AlertTypes);

  return (
    <Box>
      <Tooltip label="Details">
        <Box w="fit-content">
          <Link passHref href={`/app/alerts/${id}`}>
            <Flex
              _hover={{
                cursor: "pointer",
                color: useColorModeValue("gray.400", "gray.500"),
              }}
              w="max-content"
            >
              <Text
                fontSize="xl"
                fontWeight="normal"
                letterSpacing="normal"
                my="auto"
                mr="1em"
              >
                {name}
              </Text>
              {typeComponent}
            </Flex>
          </Link>
        </Box>
      </Tooltip>
    </Box>
  );
}
