import {
  Box,
  Button,
  Container,
  Divider,
  Flex,
  FormControl,
  FormErrorMessage,
  Heading,
  Input,
  Text,
} from "@chakra-ui/react";
import { Field, FieldInputProps, Form, Formik, FormikProps } from "formik";
import { signIn } from "next-auth/client";
import React from "react";
import { FcGoogle } from "react-icons/fc";
import { ExtendedNextPage } from "../_app";

const validateEmailSubmission = (
  email: string,
  emailRequiredMessage?: string,
  invalidMessage?: string
): string | undefined => {
  let error;

  if (!email) {
    error = emailRequiredMessage ? emailRequiredMessage : "Email is required.";
  } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(email)) {
    error = invalidMessage ? invalidMessage : "Invalid email address.";
  }

  return error;
};

const Signin: ExtendedNextPage = () => {
  const emailOnSubmit = ({ email }: { email: string }) => {
    signIn("email", { email, callbackUrl: "/app" });
  };
  const googleOnSubmit = () => signIn("google", { callbackUrl: "/app" });

  return (
    <Container p="0" shadow="md" maxW="xl" borderRadius="lg" mt="2em">
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
        <Text textAlign="center" mb="2em" color="gray.600">
          Signing in gets you access to our free tier. No credit card required.
        </Text>
        <Formik initialValues={{ email: "" }} onSubmit={emailOnSubmit}>
          {(props) => (
            <Form>
              <Flex flexDirection="column">
                <Field name="email" validate={validateEmailSubmission}>
                  {({
                    field,
                    form,
                  }: {
                    field: FieldInputProps<string>;
                    form: FormikProps<{ email: string }>;
                  }) => (
                    <FormControl
                      isInvalid={form.errors.email ? form.touched.email : false}
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
                        {form.errors.email}
                      </FormErrorMessage>
                    </FormControl>
                  )}
                </Field>
                <Button
                  isLoading={props.isSubmitting}
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
            </Form>
          )}
        </Formik>
        <Divider borderColor="gray.300" mb="2em" />
        <Button
          leftIcon={<FcGoogle />}
          onClick={googleOnSubmit}
          size="lg"
          variant="outline"
          colorScheme="blue"
          shadow="sm"
          mb="1.5em"
        >
          Sign in with Google
        </Button>
      </Flex>
    </Container>
  );
};

export default Signin;
