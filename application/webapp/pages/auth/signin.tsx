import {
  Alert,
  AlertIcon,
  Box,
  Button,
  chakra,
  Container,
  Divider,
  Flex,
  FormControl,
  FormErrorMessage,
  Heading,
  Input,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import { signIn, useSession } from "next-auth/client";
import { useRouter } from "next/router";
import React from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { FaGithub } from "react-icons/fa";
import { PageLayout } from "../../src/common/components/Page-Layout";
import { getErrorStringFromErrorCode } from "../../src/modules/auth/errors";
import { ExtendedNextPage } from "../_app";

const Signin: ExtendedNextPage = () => {
  const router = useRouter();
  const queryParams = router.query;
  let errorString;
  let emailSentString;
  if (queryParams.error) {
    errorString = getErrorStringFromErrorCode(queryParams.error as string);
  }
  if (queryParams.info && queryParams.info === "VerificationSent") {
    emailSentString =
      "We sent an email with a sign in link to you. Click on it to complete sign in.";
  }

  const [session] = useSession();
  if (session?.user) {
    router.push("/app");
  }
  //const googleOnSubmit = () => signIn("google", { callbackUrl: "/app" });
  const githubOnSubmit = () => signIn("github", { callbackUrl: "/app" });

  const {
    handleSubmit,
    formState: { errors, isSubmitting, touchedFields },
    control,
  } = useForm<{ email: string }>({
    defaultValues: { email: "" },
  });

  const onSubmit: SubmitHandler<{ email: string }> = async ({ email }) => {
    signIn("email", { email, callbackUrl: "/app" });
  };

  return (
    <PageLayout>
      <Container
        p="0"
        shadow="md"
        maxW="2xl"
        borderRadius="lg"
        mt="2em"
        bg={useColorModeValue("white", "gray.800")}
      >
        <Box
          bgGradient="linear(to-b, blue.300, blue.200)"
          w="100%"
          h="1.5em"
          borderTopRadius="lg"
          mb="1em"
        />
        <Flex flexDirection="column" w={["90%", "80%"]} m="auto">
          <Heading as="h2" textAlign="center" mb="2">
            Get started for free.
          </Heading>
          <Text
            textAlign="center"
            mb="2em"
            color={useColorModeValue("gray.800", "gray.300")}
          >
            Sign in to get access to our free tier. No credit card required.
          </Text>
          {errorString ? (
            <Alert status="error" variant="solid" borderRadius="lg" mb="1.2em">
              <AlertIcon />
              {errorString}
            </Alert>
          ) : (
            <></>
          )}
          {emailSentString ? (
            <Alert
              status="success"
              variant="solid"
              borderRadius="lg"
              mb="1.2em"
            >
              <AlertIcon />
              {emailSentString}
            </Alert>
          ) : (
            <></>
          )}
          <chakra.form onSubmit={handleSubmit(onSubmit)}>
            <Flex flexDirection="column">
              <Controller
                name="email"
                control={control}
                rules={{
                  required: "Email is required.",
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i,
                    message: "Invalid email address.",
                  },
                }}
                render={({ field }) => (
                  <FormControl
                    isInvalid={errors.email ? touchedFields.email : false}
                  >
                    <Text fontWeight="medium">Email Address:</Text>
                    <Input
                      {...field}
                      id="email"
                      placeholder="you@example.com"
                      shadow="sm"
                      size="lg"
                      mb="1.3em"
                    />

                    <FormErrorMessage mt="-1.5em" mb="1.1em">
                      {errors.email?.message}
                    </FormErrorMessage>
                  </FormControl>
                )}
              />
              <Button
                isLoading={isSubmitting}
                type="submit"
                size="lg"
                colorScheme="blue"
                color="white"
                bgGradient="linear(to-r, blue.300, blue.400)"
                shadow="sm"
                mb="2em"
              >
                Sign in with Email
              </Button>
            </Flex>
          </chakra.form>
          <Divider borderColor="gray.300" mb="2em" />
          {/* <Button
            leftIcon={<FcGoogle />}
            onClick={googleOnSubmit}
            size="lg"
            variant="outline"
            colorScheme="blue"
            shadow="sm"
            mb="1.5em"
          >
            Sign in with Google
          </Button> */}
          <Button
            leftIcon={<FaGithub />}
            onClick={githubOnSubmit}
            size="lg"
            variant="outline"
            colorScheme="black"
            shadow="sm"
            mb="1.5em"
          >
            Sign in with GitHub
          </Button>
        </Flex>
      </Container>
    </PageLayout>
  );
};

export default Signin;
