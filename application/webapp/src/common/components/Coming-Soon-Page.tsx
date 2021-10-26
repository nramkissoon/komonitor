import { Box, chakra, Flex, useColorModeValue } from "@chakra-ui/react";
import Link from "next/link";
import { PageLayout } from "./Page-Layout";

export function ComingSoonPage(props: { feature: string; isAppPage: boolean }) {
  const { feature, isAppPage } = props;
  return (
    <PageLayout isAppPage={isAppPage}>
      <Flex
        justifyContent="center"
        flexDir="column"
        textAlign="center"
        mt="4em"
      >
        <Box fontWeight="bold" fontSize="7xl">
          {feature} Coming Soon!
        </Box>
        <Box fontSize="2xl">
          Check out our{" "}
          <Link href="/roadmap">
            <chakra.span
              color={useColorModeValue("blue.500", "blue.400")}
              _hover={{ color: "gray.500", cursor: "pointer" }}
            >
              roadmap
            </chakra.span>
          </Link>{" "}
          for product updates and upcoming feature releases!
        </Box>
      </Flex>
    </PageLayout>
  );
}
