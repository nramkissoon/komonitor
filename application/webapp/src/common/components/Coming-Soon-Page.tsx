import { Box, Flex } from "@chakra-ui/react";
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
      </Flex>
    </PageLayout>
  );
}
