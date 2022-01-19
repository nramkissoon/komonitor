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
    <Flex mb="3em" flexDir="column" alignItems="center">
      <chakra.h1
        textAlign="center"
        fontSize="5xl"
        fontWeight="extrabold"
        color={useColorModeValue("gray.800", "gray.100")}
        lineHeight="shorter"
        mb="10px"
      >
        Need To Monitor API Responses? No Problem.
      </chakra.h1>
      <chakra.h2
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
      </chakra.h2>
      <Box
        w="100%"
        shadow="md"
        bg={useColorModeValue("white", "#0f131a")}
        borderRadius="lg"
        p="1.5em"
        mb="10px"
        maxW="4xl"
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
        mb=".3em"
        maxW="3xl"
      >
        Komonitor allows for advanced uptime monitoring by providing as much
        request/response configuration as possible.
      </chakra.h3>
    </Flex>
  );
};
