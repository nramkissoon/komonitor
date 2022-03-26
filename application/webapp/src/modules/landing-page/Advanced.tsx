import {
  Box,
  chakra,
  Flex,
  Grid,
  GridItem,
  Icon,
  Table,
  Tbody,
  Td,
  Thead,
  Tr,
  useColorModeValue,
  useToken,
} from "@chakra-ui/react";
import { v4 as uuidv4 } from "uuid";
import { FadeInView } from "../../common/components/Animation";

const JsonSample = () => {
  const codeString = `{
    "monitor_snapshot": {
      "last_updated": 1646434042778,
      "monitor_id": "up-8de84a39-f049-47d8-998b-560b794a3e96",
      "webhook_url": "https://webhook.site/4c8b0b8b-2b26-485e-9a76-98d5a26407a2",
      "project_id": "test-project-1",
      "up_condition_checks": [
        {
          "type": "code",
          "condition": {
            "comparison": "not_equal",
            "expected": 400
          }
        },
        {
          "type": "html_body",
          "condition": {
            "comparison": "not_contains",
            "expected": "penis"
          }
        }
      ],
      "owner_id": "e5c1126a04567a873bdfcf4d79b35b04",
      "name": "Google",
      "created_at": 1642521804933,
      "region": "us-east-1",
      "http_parameters": {
        "method": "GET",
        "headers": {
          "asdasd": "asdasdasdasdasd",
          "Content-Type": "text"
        },
        "follow_redirects": true
      },
      "url": "https://google.com",
      "frequency": 30
    },
    "status": "up",
    "timestamp": 1646753754575,
    "monitor_id": "up-8de84a39-f049-47d8-998b-560b794a3e96",
    "response": {
      "headers": {
        "date": "Tue, 08 Mar 2022 15:35:54 GMT",
        "server": "gws",
        "expires": "-1",
        "transfer-encoding": "chunked",
        "content-encoding": "gzip",
        "x-frame-options": "SAMEORIGIN",
        "p3p": "CP=\"This is not a P3P policy! See g.co/p3phelp for more info.\"",
        "set-cookie": [
          "1P_JAR=2022-03-08-15; expires=Thu, 07-Apr-2022 15:35:54 GMT; path=/; domain=.google.com; Secure",
          "NID=511=DOW8lp6Jfiw1inGXERokICcUtVxvVd71PEqbppOz4uh7XCt1tAsMDA7SGkuT4ufgCfaCsqGWGHRGyWxOGKGuCC_ldUe-C5F5GOcLxg41WbAigI-2Lhots3Aq0chvJbxLrWVLPR4xOQmWZbV1K1KNjCz4Azu3yA1tzY7MygIHvdQ; expires=Wed, 07-Sep-2022 15:35:54 GMT; path=/; domain=.google.com; HttpOnly"
        ],
        "x-xss-protection": "0",
        "content-type": "text/html; charset=ISO-8859-1",
        "connection": "close",
        "cache-control": "private, max-age=0",
        "alt-svc": "h3=\":443\"; ma=2592000,h3-29=\":443\"; ma=2592000,h3-Q050=\":443\"; ma=2592000,h3-Q046=\":443\"; ma=2592000,h3-Q043=\":443\"; ma=2592000,quic=\":443\"; ma=2592000; v=\"46,43\""
      },
      "retry_count": 0,
      "aborted": false,
      "ip": "142.250.31.105",
      "body": "Body content over 2000 characters...",
      "redirect_urls": [
        "https://www.google.com/"
      ],
      "url": "https://www.google.com/",
      "status_message": "OK",
      "request_url": "https://google.com/",
      "is_from_cache": false,
      "timings": {
        "lookup": 1646753754335,
        "secure_connect": 1646753754414,
        "upload": 1646753754414,
        "response": 1646753754472,
        "start": 1646753754333,
        "end": 1646753754476,
        "socket": 1646753754333,
        "connect": 1646753754393,
        "phases": {
          "tcp": 58,
          "request": 0,
          "wait": 0,
          "download": 4,
          "total": 143,
          "dns": 2,
          "tls": 21,
          "first_byte": 58
        }
      },
      "complete": true,
      "status_code": 200
    },
    "request": {
      "headers": {
        "asdasd": "asdasdasdasdasd",
        "content-type": "text",
        "accept-encoding": "gzip, deflate, br",
        "user-agent": "komonitor"
      },
      "method": "GET",
      "prefix_url": "",
      "is_stream": false,
      "url": {
        "protocol": "https:",
        "password": "",
        "hostname": "www.google.com",
        "search": "",
        "port": "",
        "origin": "https://www.google.com",
        "host": "www.google.com",
        "href": "https://www.google.com/",
        "hash": "",
        "username": "",
        "pathname": "/",
        "search_params": {}
      },
      "timeout": {
        "response": 5000
      },
      "response_type": "text",
      "password": "",
      "decompress": true,
      "method_rewriting": true,
      "ignore_invalid_cookies": false,
      "follow_redirect": true,
      "resolve_body_only": false,
      "cache_options": {},
      "http_2": false,
      "allow_get_body": true,
      "max_redirects": 10,
      "username": ""
    }
  }`;
  return { codeString };
};

const JsonLine = (
  key: string,
  value: number | string | null | boolean,
  indent: number,
  isLast: boolean
) => {
  const [green500, orange500, blue400, purple400] = useToken("colors", [
    "green.500",
    "orange.500",
    "blue.400",
    "purple.400",
  ]);
  let valueColor = green500;
  if (typeof value === null) valueColor = orange500;
  if (typeof value === "boolean") valueColor = blue400;
  if (typeof value === "number") valueColor = orange500;
  return (
    <chakra.p
      pl={indent * 8}
      letterSpacing="wider"
      _hover={{ bg: useColorModeValue("gray.100", "blue.900") }}
      rounded="full"
    >
      {key} :{" "}
      <chakra.span color={valueColor}>
        {typeof value === "string" ? `"${value}"` : value?.toString()}
      </chakra.span>
      {isLast ? "" : ","}
    </chakra.p>
  );
};

const JsonObjectOpener = (key: string, indent: number) => {
  return (
    <chakra.p
      pl={indent * 8}
      letterSpacing="wider"
      _hover={{ bg: useColorModeValue("gray.100", "blue.900") }}
      rounded="full"
    >
      {key} : <chakra.span>&#123;</chakra.span>
    </chakra.p>
  );
};

const JsonObjectCloser = (indent: number, isLast?: boolean) => {
  return (
    <chakra.p
      pl={indent * 8}
      letterSpacing="wider"
      _hover={{ bg: useColorModeValue("gray.100", "blue.900") }}
      rounded="full"
    >
      &#125;{isLast ? "" : ","}
    </chakra.p>
  );
};

function TableSectionRow(borderColor: string, title: string) {
  return (
    <Tr bg={useColorModeValue("gray.50", "gray.900")}>
      <Td py={2} fontSize="md" color="gray.500" borderColor={borderColor}>
        {title}
      </Td>
      <Td py={2} borderColor={borderColor}></Td>
      <Td py={2} borderColor={borderColor}></Td>
      <Td py={2} borderColor={borderColor}></Td>
    </Tr>
  );
}

function TableRows(borderColor: string, data: (string | Function)[][]) {
  const color = useColorModeValue("blue.500", "blue.300");
  return data.map((row) => (
    <Tr key={uuidv4()}>
      {row.map((cell, index) => (
        <Td
          key={uuidv4()}
          borderColor={borderColor}
          fontWeight={index === 0 ? "bold" : "inherit"}
        >
          {typeof cell === "string" ? cell : cell(color)}
        </Td>
      ))}
    </Tr>
  ));
}

function CheckIcon(color: string) {
  return (
    <Flex shrink={0}>
      <Icon
        boxSize={5}
        mt={1}
        mr={2}
        color={color}
        viewBox="0 0 20 20"
        fill="currentColor"
      >
        <path
          fillRule="evenodd"
          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
          clipRule="evenodd"
        ></path>
      </Icon>
    </Flex>
  );
}

const requestSectionData = [
  ["HTTP Methods", CheckIcon, "GET, POST, PUT, DELETE, PATCH, HEAD"],
  ["Body", CheckIcon, "Custom request bodies."],
  ["Request Headers", CheckIcon, "Up to 10 Custom HTTP Request Headers"],
];

const responseSectionData = [
  [
    "Timing Phases",
    CheckIcon,
    "DNS, TLS, time-to-first-byte, and more timings.",
  ],
  ["Body", CheckIcon, "Response body included."],
  ["Headers", CheckIcon, "Response Headers included."],
  ["and more...", "", ""],
];

export const Advanced = () => {
  const tableBorderColor = useColorModeValue("gray.100", "gray.700");
  return (
    <Flex flexDir="column" alignItems="center" as="section">
      <FadeInView
        obvProps={{ threshold: 0.5, rootMargin: "0px 0px -300px 0px" }}
        inAnimation="motion-safe:animate-scale-fade-in"
        outAnimation="motion-safe:animate-scale-fade-out"
      >
        <chakra.h2
          textAlign="center"
          fontSize="5xl"
          fontWeight="extrabold"
          color={useColorModeValue("gray.800", "gray.100")}
          lineHeight="shorter"
          mb="10px"
        >
          Need To Monitor API Responses?
        </chakra.h2>
        <chakra.h3
          fontSize="2xl"
          fontWeight="bold"
          textAlign="center"
          lineHeight="shorter"
          w={["70%"]}
          mx="auto"
          color={useColorModeValue("gray.600", "gray.400")}
          mb="2em"
        >
          Customize your monitor's HTTP requests to match your use case and
          analyze the response.
        </chakra.h3>
      </FadeInView>
      <Grid
        templateColumns={[
          "repeat(1, 1fr)",
          null,
          null,
          null,
          null,
          "repeat(2, 1fr)",
        ]}
        gap={6}
        maxW="9xl"
        mb="10px"
      >
        <GridItem
          w="100%"
          shadow="md"
          bg={useColorModeValue("white", "gray.950")}
          borderRadius="lg"
          p="1.5em"
          mb="10px"
        >
          <Box
            overflow="auto"
            css={{
              "&::-webkit-scrollbar": {
                width: "10px",
                height: "10px",
              },
              "&::-webkit-scrollbar-track": {
                width: "10px",
                height: "10px",
              },
              "&::-webkit-scrollbar-thumb": {
                background: useColorModeValue("#E2E8F0", "#1A202C"),
              },
            }}
          >
            <Table>
              <Thead></Thead>
              <Tbody>
                {TableSectionRow(tableBorderColor, "Custom Request Parameters")}
                {TableRows(tableBorderColor, requestSectionData)}
                {TableSectionRow(tableBorderColor, "Response Data")}
                {TableRows(tableBorderColor, responseSectionData)}
              </Tbody>
            </Table>
          </Box>
        </GridItem>

        <GridItem
          w="100%"
          shadow="md"
          bg={useColorModeValue("white", "gray.950")}
          borderRadius="lg"
          p="1.5em"
          mb="10px"
          maxH={"600px"}
          overflowY="auto"
          css={{
            "&::-webkit-scrollbar": {
              width: "10px",
              height: "10px",
            },
            "&::-webkit-scrollbar-track": {
              width: "10px",
              height: "10px",
            },
            "&::-webkit-scrollbar-thumb": {
              background: useColorModeValue("#E2E8F0", "#1A202C"),
            },
          }}
        >
          <Box>
            &#123;
            {JsonObjectOpener("monitor_snapshot", 1)}
            {JsonLine(
              "monitor_id",
              "up-8de84a39-f049-47d8-998b-560b794a3e96",
              2,
              false
            )}
            {JsonLine("name", "My-Website-Monitor", 2, false)}
            {JsonLine("project_id", "My Website", 2, false)}
            {JsonLine("owner_id", "e5c1126a04567a873bdfcf4d79b35b04", 2, false)}
            {JsonLine("region", "us-east-1", 2, false)}
            {JsonObjectOpener("http_parameters", 2)}
            {JsonLine("method", "GET", 3, false)}
            {JsonObjectOpener("headers", 3)}
            {JsonLine("Content-Type", "text", 4, false)}
            {JsonObjectCloser(3)}
            {JsonLine("follow_redirects", true, 3, false)}
            {JsonObjectCloser(2)}
            {JsonLine("url", "https://my-website.com", 2, false)}
            {JsonLine("frequency", 30, 2, true)}
            {JsonObjectCloser(1)}
            {JsonLine("status", "up", 1, false)}
            {JsonLine("timestamp", 1646753754575, 1, false)}
            {JsonLine(
              "monitor_id",
              "up-8de84a39-f049-47d8-998b-560b794a3e96",
              1,
              false
            )}
            {JsonObjectOpener("response", 1)}
            {JsonLine("body", "<response body>", 2, false)}
            {JsonLine("status_code", 200, 2, false)}
            {JsonLine("status_message", "OK", 2, false)}
            {JsonObjectOpener("headers", 2)}
            {JsonLine(
              "content-type",
              "text/html; charset=ISO-8859-1",
              3,
              false
            )}
            {JsonObjectCloser(2)}
            {JsonObjectOpener("timings", 2)}
            {JsonLine("start", 1646753754333, 3, false)}
            {JsonLine("lookup", 1646753754335, 3, false)}
            {JsonLine("socket", 1646753754333, 3, false)}
            {JsonLine("connect", 1646753754393, 3, false)}
            {JsonLine("secure_connect", 1646753754414, 3, false)}
            {JsonLine("upload", 1646753754414, 3, false)}
            {JsonLine("response", 1646753754472, 3, false)}
            {JsonLine("end", 1646753754476, 3, false)}
            {JsonObjectOpener("phases", 3)}
            {JsonLine("wait", 0, 4, false)}
            {JsonLine("dns", 2, 4, false)}
            {JsonLine("tcp", 58, 4, false)}
            {JsonLine("tls", 21, 4, false)}
            {JsonLine("request", 0, 4, false)}
            {JsonLine("first_byte", 58, 4, false)}
            {JsonLine("download", 4, 4, false)}
            {JsonLine("total", 143, 4, true)}
            {JsonObjectCloser(3, true)}
            {JsonObjectCloser(2, true)}
            {JsonObjectCloser(1, true)}
            &#125;
          </Box>
        </GridItem>
      </Grid>

      <chakra.h3
        fontSize="2xl"
        fontWeight="bold"
        textAlign="center"
        lineHeight="shorter"
        mx="auto"
        color={useColorModeValue("gray.800", "gray.100")}
        maxW="3xl"
      >
        Komonitor allows for advanced uptime monitoring by providing as much
        request/response configuration as possible.
      </chakra.h3>
    </Flex>
  );
};
