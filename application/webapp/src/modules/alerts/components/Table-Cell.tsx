import { Button } from "@chakra-ui/button";
import { EmailIcon } from "@chakra-ui/icons";
import { Badge, Box, Flex } from "@chakra-ui/layout";
import { Text, useColorModeValue } from "@chakra-ui/react";
import { Tooltip } from "@chakra-ui/tooltip";
import Link from "next/link";
import { AlertStates, AlertTypes } from "project-types";
import React from "react";

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

const EmailTypeComponent = (
  <Button
    leftIcon={<EmailIcon />}
    colorScheme="gray"
    variant="outline"
    as="div"
    _hover={{}}
    size="xs"
    color="gray.500"
    fontWeight="normal"
  >
    Email
  </Button>
);

export function AlertNameAndTypeCell(props: AlertNameAndTypeCellProps) {
  const { name, id, type } = props;

  let typeComponent;
  switch (type) {
    case "Email":
      typeComponent = EmailTypeComponent;
      break;
    default:
      typeComponent = <></>;
      break;
  }

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
