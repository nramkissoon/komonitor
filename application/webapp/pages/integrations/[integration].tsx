import {
  Box,
  Button,
  chakra,
  Flex,
  Heading,
  Image,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import { capitalize } from "lodash";
import Link from "next/link";
import { useRouter } from "next/router";
import { PageLayout } from "../../src/common/components/Page-Layout";
import {
  DiscordSvg,
  GmailSvg,
  SlackSvg,
  WebhookSvg,
} from "../../src/modules/integrations/components/Icons";

const SideBarItem = ({
  href,
  name,
  isSelected,
}: {
  href: string;
  name: string;
  isSelected: boolean;
}) => {
  return (
    <Link href={href} passHref>
      <Flex
        as="a"
        aria-disabled={isSelected}
        _disabled={{
          color: useColorModeValue("black", "white"),
          borderColor: useColorModeValue("blue.500", "blue.400"),
          bg: useColorModeValue("gray.200", "gray.800"),
        }}
        borderLeft="2px"
        borderColor={useColorModeValue("gray.500", "whiteAlpha.500")}
        color={useColorModeValue("gray.500", "whiteAlpha.500")}
        rounded={"none"}
        fontSize="md"
        px="5"
        py="2"
        flexDir={"row"}
        _hover={{
          color: useColorModeValue("black", "white"),
          borderColor: useColorModeValue("blue.500", "blue.400"),
          bg: useColorModeValue("gray.200", "gray.800"),
        }}
      >
        <Box>{capitalize(name)}</Box>
      </Flex>
    </Link>
  );
};

const contentData: {
  [key: string]: {
    icon: React.ReactElement;
    header: string;
    description: string;
    bg: string;
    integHeader: string;
    img?: string;
    cta: {
      header: string;
    };
  };
} = {
  discord: {
    icon: DiscordSvg,
    header: "Discord",
    description: "Receive alerts directly to your Discord server channels.",
    bg: "#7289da",
    integHeader: "Integrate with OAuth2",
    cta: {
      header: "Bring website monitoring to Discord.",
    },
  },
  slack: {
    icon: SlackSvg,
    header: "Slack",
    description: "Receive alerts directly to your Slack channels.",
    bg: "#4a154b",
    integHeader: "Works seamlessly with OAuth2 integration.",
    img: "/integrations/slack-alert.png",
    cta: {
      header: "Get downtime alerts sent to Slack.",
    },
  },
  email: {
    icon: GmailSvg,
    header: "Email",
    description: "Receive alerts and reports directly to your email inbox.",
    bg: "gray.700",
    integHeader: "Add your email to receive alerts.",
    img: "/integrations/email-integ.png",
    cta: {
      header: "Get downtime alerts sent to your inbox.",
    },
  },
  webhook: {
    icon: WebhookSvg,
    header: "Webhooks",
    description:
      "Receive alerts and status updates directly to your own application's HTTP endpoints with webhooks.",
    bg: "pink.500",
    integHeader: "Register a webhook endpoint in your monitors' settings.",
    img: "/integrations/webhook-integ.png",
    cta: {
      header: "Get monitor status webhooks sent to your apps.",
    },
  },
};

const Content = ({ selected }: { selected: string }) => {
  const data = contentData[selected];
  return (
    <Box flexGrow="1">
      <Flex h="fit-content" mb="18px">
        <Box>
          <Box
            boxSize={20}
            p="10px"
            bg={"white"}
            rounded="xl"
            display={["none", null, "table-cell"]}
            verticalAlign="middle"
          >
            {data?.icon}
          </Box>
        </Box>

        <Flex
          ml="14px"
          flexDir={"column"}
          justifyContent="space-between"
          h="fit-content"
        >
          <Heading as="h1" fontSize={"5xl"}>
            {data?.header}
          </Heading>
          <Heading as="h2" fontSize={"lg"} fontWeight="medium">
            {data?.description}
          </Heading>
        </Flex>
      </Flex>
      <Box
        bg={data?.bg}
        w="100%"
        h={["150px", "200px", null, "300px"]}
        rounded={"2xl"}
        display={"table-cell"}
        verticalAlign="middle"
      >
        <Image
          src={data?.img}
          alt="example alert in Slack app"
          maxW={["90%", null, null, "80%"]}
          m="auto"
          rounded={"xl"}
          shadow="lg"
        />
      </Box>
      <Box mt="20px" fontSize="2xl" fontWeight={"medium"}>
        {data?.integHeader}
      </Box>
      <Flex
        as="section"
        flexDir="column"
        alignItems="center"
        bg={useColorModeValue("white", "gray.950")}
        borderRadius="3xl"
        shadow="xl"
        px="2em"
        m="auto"
        mb="5em"
        mt="75px"
        pt="30px"
      >
        <chakra.h2
          textAlign="center"
          fontSize="4xl"
          fontWeight="extrabold"
          color={useColorModeValue("gray.800", "gray.100")}
          lineHeight="shorter"
          mb=".2em"
        >
          {data?.cta?.header}
        </chakra.h2>
        <chakra.h3
          fontSize="2xl"
          fontWeight="bold"
          textAlign="center"
          lineHeight="shorter"
          w={["70%"]}
          mx="auto"
          color={useColorModeValue("gray.600", "gray.400")}
          mb=".8em"
        >
          ""
        </chakra.h3>
        <Link href="/auth/signin" passHref>
          <Button
            colorScheme="blue"
            bgColor="blue.300"
            fontSize="2xl"
            fontWeight="medium"
            color="white"
            _hover={{
              bg: "blue.600",
            }}
            shadow="lg"
            mb=".5em"
            w={["80%", null, "40%", null, "30%"]}
            py="1em"
          >
            Get Started
          </Button>
        </Link>
        <chakra.h3
          color="gray.500"
          textAlign="center"
          mb="30px"
          fontSize="large"
        >
          {"No credit card required, free forever."}
        </chakra.h3>
      </Flex>
    </Box>
  );
};

const SideBar = ({ selected }: { selected: string }) => {
  return (
    <Box>
      <Text fontWeight={"medium"} letterSpacing="wider" fontSize={"sm"}>
        INTEGRATIONS
      </Text>
      <Flex mt="10px" flexDir={"column"} w="fit-content">
        <SideBarItem
          href={"/integrations/discord"}
          name="discord"
          isSelected={"discord" === selected}
        />
        <SideBarItem
          href={"/integrations/slack"}
          name="slack"
          isSelected={"slack" === selected}
        />
        <SideBarItem
          href={"/integrations/email"}
          name="email"
          isSelected={"email" === selected}
        />
        <SideBarItem
          href={"/integrations/webhook"}
          name="webhook"
          isSelected={"webhook" === selected}
        />
      </Flex>
    </Box>
  );
};

export default function Integrations() {
  const { integration } = useRouter().query;

  return (
    <PageLayout isAppPage={false}>
      <Flex gap={[4, null, "100px"]}>
        <SideBar selected={integration as string} />
        <Content selected={integration as string} />
      </Flex>
    </PageLayout>
  );
}
