import { ExternalLinkIcon } from "@chakra-ui/icons";
import * as Chakra from "@chakra-ui/react";
import {
  Alert,
  AlertIcon,
  Box,
  Button,
  Center,
  chakra,
  Flex,
  useColorModeValue,
} from "@chakra-ui/react";
import NextLink from "next/link";
import { PrismLight as SyntaxHighlighter } from "react-syntax-highlighter";
import { dracula as theme } from "react-syntax-highlighter/dist/cjs/styles/prism";

export const MDXComponents = {
  ...Chakra,
  h1: (props: any) => (
    <chakra.h1
      apply="mdx.h1"
      fontWeight="extrabold"
      fontSize="6xl"
      {...props}
    />
  ),
  h2: (props: any) => (
    <chakra.h2
      apply="mdx.h2"
      fontWeight="extrabold"
      fontSize="4xl"
      mb=".4em"
      mt=".7em"
      {...props}
    />
  ),
  h3: (props: any) => (
    <chakra.h3
      apply="mdx.h3"
      fontWeight="bold"
      fontSize="3xl"
      mb=".4em"
      mt=".7em"
      {...props}
    />
  ),
  p: (props: any) => <chakra.p fontSize="xl" mt="1em" {...props} />,
  a: (props: any) => (
    <NextLink href={props.href} passHref>
      <chakra.a
        color={useColorModeValue("blue.400", "blue.500")}
        _hover={{ cursor: "pointer", color: "gray.500" }}
      >
        {props.children}
      </chakra.a>
    </NextLink>
  ),
  externalLink: (props: any) => (
    <NextLink href={props.href} passHref>
      <Button
        rightIcon={<ExternalLinkIcon boxSize="5" ml="-4px" />}
        colorScheme="blue"
        variant="unstyled"
        as="a"
        target="_blank"
        color={useColorModeValue("blue.400", "blue.500")}
        _hover={{ cursor: "pointer", color: "gray.500" }}
        fontWeight="medium"
        fontSize="xl"
      >
        {props.children}
      </Button>
    </NextLink>
  ),
  li: (props: any) => <chakra.li fontSize="xl" mt=".2em" ml="1em" {...props} />,
  blockquote: (props: any) => (
    <Alert
      status="error"
      variant="left-accent"
      as="blockquote"
      rounded="4px"
      mt="7px"
    >
      <AlertIcon />
      <div {...props}></div>
    </Alert>
  ),

  docImg: (props: any) => (
    <Center w={"100%"} m={0} p={5} my={3} rounded="xl" bg="gray.600">
      <img
        {...props}
        style={{
          imageRendering: "-webkit-optimize-contrast",
          borderRadius: "10px",
        }}
      />
    </Center>
  ),

  BlogCta: (props: any & { ctaMessage: string }) => (
    <Box
      mt="5em"
      bg={useColorModeValue("gray.700", "gray.950")}
      borderRadius="2xl"
      p={["1em", null, "1.5em"]}
      shadow="lg"
      mb="1.5em"
      maxW="3xl"
      mx="auto"
    >
      <Flex
        flexDir="column"
        alignItems="center"
        bg={useColorModeValue("white", "gray.950")}
        borderRadius="xl"
        p="1.5em"
      >
        <Box>
          <chakra.h1
            textAlign="center"
            fontSize="4xl"
            fontWeight="extrabold"
            color={useColorModeValue("gray.800", "gray.100")}
            lineHeight="shorter"
            mb=".2em"
          >
            {props.ctaMessage}
          </chakra.h1>

          <chakra.h2
            fontSize="2xl"
            fontWeight="bold"
            textAlign="center"
            lineHeight="shorter"
            w={["70%"]}
            mx="auto"
            color={useColorModeValue("gray.600", "gray.400")}
            mb="1.2em"
          >
            Sign up to access Komonitor's free tier.
          </chakra.h2>
        </Box>

        <NextLink href={"/auth/signin"} passHref>
          <Button
            size="lg"
            colorScheme="blue"
            bgColor="blue.300"
            fontSize="3xl"
            fontWeight="bold"
            color="white"
            _hover={{
              bg: "blue.600",
            }}
            shadow="lg"
            mb=".5em"
            py="1em"
            px="1em"
          >
            Get Started
          </Button>
        </NextLink>

        <chakra.h3 color="gray.500" textAlign="center" fontSize="large">
          No credit card required, free forever.
        </chakra.h3>
      </Flex>
    </Box>
  ),
  code: (props: any) => (
    <SyntaxHighlighter
      style={theme}
      showLineNumbers
      {...props}
      language={"javascript"}
      // eslint-disable-next-line react/no-children-prop
      children={(props.children as string).slice(0, -1)}
    />
  ),
};
