import { Box, chakra, Flex, useColorModeValue } from "@chakra-ui/react";
import Link from "next/link";
import { PageLayout } from "../src/common/components/Page-Layout";

export default function Custom404() {
  return (
    <PageLayout isAppPage={false}>
      <Flex justifyContent="center" flexDir="column" textAlign="center">
        <Box fontWeight="bold" fontSize="8xl">
          404
        </Box>
        <Box fontSize="xl">Oops! Looks like this page does not exist.</Box>
        <Box fontSize="xl">
          If you think this is a mistake. Please{" "}
          <Link href="/contact">
            <chakra.span
              color={useColorModeValue("blue.500", "blue.400")}
              _hover={{ color: "gray.500", cursor: "pointer" }}
            >
              contact us
            </chakra.span>
          </Link>
          .
        </Box>
      </Flex>
    </PageLayout>
  );
}
