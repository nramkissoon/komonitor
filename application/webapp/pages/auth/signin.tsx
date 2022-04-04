import {
  Alert,
  AlertIcon,
  Box,
  Button,
  chakra,
  Divider,
  Flex,
  FormControl,
  FormErrorMessage,
  Grid,
  GridItem,
  Heading,
  Input,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { FaGithub } from "react-icons/fa";
import { PageLayout } from "../../src/common/components/Page-Layout";
import { getErrorStringFromErrorCode } from "../../src/modules/auth/errors";
import {
  DiscordSvg,
  GmailSvg,
  SlackSvg,
  WebhookSvg,
} from "../../src/modules/integrations/components/Icons";
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

  const { data: session } = useSession();
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
      <Grid
        px="40px"
        py="2em"
        shadow="lg"
        maxW="4xl"
        minW="xl"
        borderRadius="lg"
        mt="2em"
        mx="auto"
        bg={useColorModeValue("white", "gray.800")}
        templateColumns={["repeat(2, 1fr)"]}
        gap={8}
      >
        <GridItem>
          <Flex flexDir="column" gap={10} justifyContent="center" h="full">
            <Box>
              <Heading as="h3" fontSize="xl">
                Uptime Monitoring
              </Heading>
              <Text color={useColorModeValue("gray.600", "gray.300")}>
                Monitor your websites and API's in minutes. Get started with 80
                monitors.
              </Text>
            </Box>
            <Box>
              <Heading as="h3" fontSize="xl">
                Alerts
              </Heading>
              <Text color={useColorModeValue("gray.600", "gray.300")}>
                Get alerts when things go wrong instantly, before your users
                notice.
              </Text>
            </Box>
            <Box>
              <Heading as="h3" fontSize="xl">
                Integrations
              </Heading>
              <Text mb="3px" color={useColorModeValue("gray.600", "gray.300")}>
                Integrate with your favorite and existing tools.
              </Text>
              <Flex gap={3}>
                <Box h="20px" w="20px">
                  {SlackSvg}
                </Box>
                <Box h="20px" w="20px">
                  {DiscordSvg}
                </Box>
                <Box h="20px" w="20px">
                  {WebhookSvg}
                </Box>
                <Box h="20px" w="20px">
                  {GmailSvg}
                </Box>
              </Flex>
            </Box>
          </Flex>
        </GridItem>
        <GridItem>
          <Flex flexDirection="column" w="full" m="auto">
            <Heading as="h2" textAlign="center" mb="2">
              Sign in
            </Heading>
            <Text
              textAlign="center"
              mb="2em"
              color={useColorModeValue("gray.700", "gray.300")}
            >
              Welcome! Sign in to get started.
            </Text>
            {errorString ? (
              <Alert
                status="error"
                variant="solid"
                borderRadius="lg"
                mb="1.2em"
              >
                <AlertIcon />
                {errorString}
              </Alert>
            ) : (
              <></>
            )}

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
                >
                  Sign in with Email
                </Button>
              </Flex>
            </chakra.form>
          </Flex>
        </GridItem>
      </Grid>
    </PageLayout>
  );
};

export default Signin;
