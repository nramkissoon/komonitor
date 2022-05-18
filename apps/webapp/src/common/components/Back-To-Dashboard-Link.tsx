import { ArrowBackIcon } from "@chakra-ui/icons";
import { Link, useColorModeValue } from "@chakra-ui/react";
import NextLink from "next/link";

export const BackToDashboardButton = () => {
  return (
    <NextLink href="/app" passHref>
      <Link
        p="0"
        bg="none"
        color={useColorModeValue("gray.400", "gray.500")}
        _hover={{ color: "blue.600" }}
        display="flex"
        w="fit-content"
        alignItems="center"
      >
        <ArrowBackIcon /> Return to dashboard
      </Link>
    </NextLink>
  );
};
