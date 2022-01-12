import { Button, chakra, Flex, Heading } from "@chakra-ui/react";
import NextLink from "next/link";
import { PageLayout } from "../../src/common/components/Page-Layout";
import { ExtendedNextPage } from "../_app";

const Page: ExtendedNextPage = () => {
  return (
    <PageLayout isAppPage>
      <Flex alignItems="center" flexDir="column" width="full">
        <Heading as="h1" fontSize="4xl" fontWeight="bold">
          Welcome! Thanks for using Komonitor!
        </Heading>
        <Heading mt="1rem" as="h2" fontSize="2xl" fontWeight="medium">
          Let's help you get some monitors up and running.
        </Heading>
        <NextLink href="/app/uptime/new" passHref>
          <Button
            as="a"
            size="lg"
            colorScheme="blue"
            color="white"
            bg="blue.400"
            shadow="md"
            fontSize="lg"
            fontWeight="normal"
            _hover={{ bg: "blue.600" }}
            mt="3rem"
          >
            Click here to create your first monitor
          </Button>
        </NextLink>
        <chakra.div my="1rem" fontSize="lg" fontWeight="medium">
          or
        </chakra.div>
        <NextLink href="/docs/getting-started/introduction" passHref>
          <Button
            size="md"
            colorScheme="gray"
            bg="gray.400"
            color="white"
            shadow="md"
            fontSize="md"
            fontWeight="normal"
            _hover={{ bg: "gray.500" }}
          >
            Read the docs
          </Button>
        </NextLink>
      </Flex>
    </PageLayout>
  );
};

Page.requiresAuth = true;
export default Page;
