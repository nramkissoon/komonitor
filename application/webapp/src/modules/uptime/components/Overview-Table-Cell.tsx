import { Box, Text, useColorModeValue } from "@chakra-ui/react";
import Link from "next/link";
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
            color: useColorModeValue("purple.600", "purple.300"),
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
