import {
  Box,
  chakra,
  Flex,
  Icon,
  Table,
  Tbody,
  Td,
  Thead,
  Tr,
  useColorModeValue,
} from "@chakra-ui/react";
import { v4 as uuidv4 } from "uuid";

const JsonSample = () => {
  const codeString = `{
    "monitor_snapshot": {
      "monitor_id": "up-8de84a39-f049-47d8-998b-560b794a3e96",
      "name": "My-Website-Monitor",
      "project_id": "My Website",
      "owner_id": "e5c1126a04567a873bdfcf4d79b35b04",
      "region": "us-east-1",
      "http_parameters": {
        "method": "GET",
        "headers": {
          "Content-Type": "text"
        }
      },
      "url": "https://my-website.com",
      "frequency": 30
    },
    "status": "up",
    "complete": true,
    "statusCode": 200,
    "timings": {
        "lookup": 1643294154262,
        "secureConnect": 1643294154320,
        "upload": 1643294154320,
        "response": 1643294154356,
        "start": 1643294154262,
        "end": 1643294154359,
        "socket": 1643294154262,
        "connect": 1643294154300,
      "phases": {
        "tcp": 38,
        "request": 0,
        "wait": 0,
        "download": 3,
        "total": 97,
        "dns": 0,
        "tls": 20,
        "firstByte": 36
      }
    }
  }`;
  return { codeString };
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
      <chakra.h2
        textAlign="center"
        fontSize="5xl"
        fontWeight="extrabold"
        color={useColorModeValue("gray.800", "gray.100")}
        lineHeight="shorter"
        mb="10px"
      >
        Need To Monitor API Responses? No Problem.
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

      <Box
        w="100%"
        shadow="md"
        bg={useColorModeValue("white", "gray.950")}
        borderRadius="lg"
        p="1.5em"
        mb="10px"
        maxW="7xl"
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
      </Box>
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

const codeString = `
{
  "type": "uptime-monitor-status",
  "data": {
    "monitor_id": "up-0c5c19a8-e52c-45fb-b86b-b25de7c74db1",
    "timestamp": 1646434754040,
    "status": "up",
    "response": {
      "timings": {
        "start": 1646434753600,
        "socket": 1646434753600,
        "lookup": 1646434753620,
        "connect": 1646434753659,
        "secure_connect": 1646434753680,
        "upload": 1646434753680,
        "response": 1646434753740,
        "end": 1646434753741,
        "phases": {
          "wait": 0,
          "dns": 20,
          "tcp": 39,
          "tls": 21,
          "request": 0,
          "first_byte": 60,
          "download": 1,
          "total": 141
        }
      },
      "body": "Body content over 2000 characters...",
      "headers": {
        "date": "Fri, 04 Mar 2022 22:59:13 GMT",
        "expires": "-1",
        "cache-control": "private, max-age=0",
        "content-type": "text/html; charset=ISO-8859-1",
        "p3p": "CP=\"This is not a P3P policy! See g.co/p3phelp for more info.\"",
        "content-encoding": "gzip",
        "server": "gws",
        "x-xss-protection": "0",
        "x-frame-options": "SAMEORIGIN",
        "set-cookie": [
          "1P_JAR=2022-03-04-22; expires=Sun, 03-Apr-2022 22:59:13 GMT; path=/; domain=.google.com; Secure",
          "NID=511=nLImcbc5Q6UXstGHTQfEQN3YaPtQ9-j9Bx5W1FBC0EZQPVRghyCQ-wXZj9Bb4z_1sowoQSP9y85AuJ5hefeY1Izk6ttJpkl_g2rZEJ_F_sniz1nb76mgu_fWZoaUInRgQ6NdTan7XRGFvYsMNhxlM1kfmUxXw8ODKd1ioqf0zEA; expires=Sat, 03-Sep-2022 22:59:13 GMT; path=/; domain=.google.com; HttpOnly"
        ],
        "alt-svc": "h3=\":443\"; ma=2592000,h3-29=\":443\"; ma=2592000,h3-Q050=\":443\"; ma=2592000,h3-Q046=\":443\"; ma=2592000,h3-Q043=\":443\"; ma=2592000,quic=\":443\"; ma=2592000; v=\"46,43\"",
        "connection": "close",
        "transfer-encoding": "chunked"
      },
      "redirect_urls": [
        "https://www.google.com/"
      ],
      "request_url": "https://google.com/",
      "retry_count": 0,
      "ip": "142.250.31.147",
      "url": "https://www.google.com/",
      "status_code": 200,
      "status_message": "OK",
      "is_from_cache": false,
      "aborted": false,
      "complete": true
    },
    "request": {
      "method": "GET",
      "headers": {
        "user-agent": "komonitor",
        "accept-encoding": "gzip, deflate, br"
      },
      "decompress": true,
      "follow_redirect": true,
      "is_stream": false,
      "response_type": "text",
      "resolve_body_only": false,
      "max_redirects": 10,
      "prefix_url": "",
      "method_rewriting": true,
      "ignore_invalid_cookies": false,
      "http_2": false,
      "allow_get_body": true,
      "cache_options": {},
      "url": "https://www.google.com/",
      "username": "",
      "password": "",
      "timeout": {
        "response": 5000
      }
    },
    "monitor_snapshot": {
      "last_updated": 1646434260649,
      "http_parameters": {
        "method": "GET",
        "follow_redirects": true
      },
      "created_at": 1646433429943,
      "up_condition_checks": [],
      "frequency": 30,
      "monitor_id": "up-0c5c19a8-e52c-45fb-b86b-b25de7c74db1",
      "url": "https://google.com",
      "name": "google-test",
      "owner_id": "paid-team",
      "webhook_url": "https://webhook.site/4c8b0b8b-2b26-485e-9a76-98d5a26407a2",
      "project_id": "zero-created",
      "region": "us-east-1"
    }
  }
}
`;
