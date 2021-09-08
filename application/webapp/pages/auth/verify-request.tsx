import { Box, Container, Heading, Text } from "@chakra-ui/react";
import { ExtendedNextPage } from "../_app";

const VerifyRequest: ExtendedNextPage = () => {
  return (
    <Container
      p="0"
      shadow="md"
      maxW="xl"
      borderRadius="lg"
      mt="2em"
      textAlign="center"
    >
      <Box
        bgGradient="linear(to-b, blue.300, blue.200)"
        w="100%"
        h="1.5em"
        borderTopRadius="lg"
        mb="1em"
      />
      <Container pb="3em" pt="1em">
        <Heading mb="3">We sent a verification email.</Heading>
        <Text fontWeight="medium" fontSize="md">
          To verify your email, click the link in the email we sent to your
          inbox.
        </Text>
      </Container>
    </Container>
  );
};

export default VerifyRequest;
