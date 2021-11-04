import {
  Box,
  chakra,
  Fade,
  Heading,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import Link from "next/link";
import React from "react";

export function ContactSection() {
  return (
    <Fade in={true}>
      <Box
        display="flex"
        flexDir="column"
        alignItems="center"
        textAlign="center"
      >
        <Heading fontSize="4xl" mb=".6em">
          Any Questions?
        </Heading>
        <Text fontSize="xl" maxW={["4xl"]}>
          Our{" "}
          <Link href="/faq">
            <chakra.span
              color={useColorModeValue("blue.500", "blue.400")}
              _hover={{ color: "gray.500", cursor: "pointer" }}
            >
              FAQ
            </chakra.span>
          </Link>{" "}
          page covers commonly asked pricing/plan questions. For any other
          questions, feel free to{" "}
          <Link href="mailto:nick@komonitor.com">
            <chakra.span
              color={useColorModeValue("blue.500", "blue.400")}
              _hover={{ color: "gray.500", cursor: "pointer" }}
            >
              contact us
            </chakra.span>
          </Link>
          .
        </Text>
      </Box>
    </Fade>
  );
}
