import { Box, chakra, Flex, useColorModeValue } from "@chakra-ui/react";
import Link from "next/link";
import { PageLayout } from "../src/common/components/Page-Layout";

export default function Custom404() {
  return (
    <PageLayout isAppPage={false}>
      <Flex justifyContent="center" flexDir="column" textAlign="center">
        <Box fontWeight="extrabold" fontSize="8xl">
          404
        </Box>
        <Box fontSize="2xl" fontWeight="bold">
          Oops! Looks like this page does not exist.
        </Box>
        <Box fontSize="2xl" fontWeight="bold">
          If you think this is a mistake, please{" "}
          <Link href="mailto:nick@komonitor.com">
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
