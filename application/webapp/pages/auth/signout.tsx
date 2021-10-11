import { Button, Container, Heading } from "@chakra-ui/react";
import { signOut } from "next-auth/client";
import React from "react";
import { PageLayout } from "../../src/common/components/Page-Layout";
import { ExtendedNextPage } from "../_app";

const Signout: ExtendedNextPage = () => {
  return (
    <PageLayout>
      <Container p="0" maxW="xl" borderRadius="lg" mt="2em" textAlign="center">
        <Container pt="1em">
          <Heading mb="5" fontSize="4xl">
            Are you sure you want to sign out?
          </Heading>
          <Button
            size="lg"
            colorScheme="blue"
            color="white"
            bgGradient="linear(to-r, blue.300, blue.400)"
            shadow="md"
            mb="2em"
            w="50%"
            onClick={() => signOut({ callbackUrl: "/" })}
          >
            Sign out
          </Button>
        </Container>
      </Container>
    </PageLayout>
  );
};

Signout.requiresAuth = true;

export default Signout;
