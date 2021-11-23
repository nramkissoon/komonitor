import {
  Button,
  chakra,
  Flex,
  SimpleGrid,
  useColorModeValue,
} from "@chakra-ui/react";
import NextLink from "next/link";

const Link = (props: { href: string; children: React.ReactNode }) => (
  <NextLink href={props.href} passHref>
    <chakra.a
      color={useColorModeValue("blue.400", "blue.500")}
      _hover={{ cursor: "pointer", color: "gray.500" }}
    >
      {props.children}
    </chakra.a>
  </NextLink>
);

const Panel = (props: {
  type: string;
  description: string;
  href: string;
  buttonText: string;
}) => {
  const { type, description, href, buttonText } = props;
  return (
    <Flex
      bg={useColorModeValue("white", "#0f131a")}
      shadow="lg"
      borderRadius="xl"
      py="2em"
      px="1.5em"
      flexDir="column"
    >
      <chakra.h1 fontSize="4xl" fontWeight="normal" mb=".6em">
        {type}
      </chakra.h1>
      <chakra.h3
        mb="1em"
        fontSize="2xl"
        fontWeight="normal"
        textAlign={["center", "center", "left"]}
      >
        {description}
      </chakra.h3>
      <NextLink passHref href={href}>
        <Button
          float="left"
          size="lg"
          as="a"
          fontSize="xl"
          fontWeight="bold"
          px="1em"
          shadow="md"
          colorScheme="blue"
          bgColor="blue.400"
          color="white"
          _hover={{
            bg: "blue.600",
          }}
        >
          {buttonText}
        </Button>
      </NextLink>
    </Flex>
  );
};

export function AppIndexPage() {
  return (
    <Flex flexDir="column">
      <Flex
        mb="2em"
        justifyContent="space-between"
        flexDir={["column", "column", "row"]}
      >
        <chakra.h3 fontSize="2xl" fontWeight="bold">
          Welcome!
        </chakra.h3>
        <chakra.h3 fontSize="2xl" fontWeight="bold">
          New to Komonitor? Check out the{" "}
          <Link href="/docs/getting-started/introduction">
            docs to get started
          </Link>
          !
        </chakra.h3>
      </Flex>
      <SimpleGrid columns={[1, 1, 2]} spacingX={[6, 10]} spacingY={[10]}>
        <Panel
          type={"✅ Uptime Monitors"}
          description={"Create and manage uptime monitors for you websites."}
          href={"/app/uptime"}
          buttonText={"Go to Monitors"}
        />
        <Panel
          type={"🚨 Alerts"}
          description={
            "Create and manage alerts and attach them to your monitors."
          }
          href={"/app/alerts"}
          buttonText={"Go to Alerts"}
        />
        <Panel
          type={"⚙️ Account Settings"}
          description={
            "Manage your account settings, subscriptions, and integrations."
          }
          href={"/app/settings"}
          buttonText={"Go to Account"}
        />
      </SimpleGrid>
    </Flex>
  );
}
