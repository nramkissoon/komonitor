import { Button, useColorModeValue } from "@chakra-ui/react";
import Link from "next/link";

export const CreateButton = () => {
  return (
    <Link passHref href="/app/uptime/new">
      <Button
        size="lg"
        as="a"
        bgGradient={useColorModeValue(
          "linear(to-r, blue.500, blue.400)",
          "linear(to-r, blue.300, blue.400)"
        )}
        colorScheme="blue"
        fontSize="lg"
        fontWeight="medium"
        color="white"
        p="1em"
        shadow="md"
        _hover={{
          bgGradient: useColorModeValue(
            "linear(to-l, blue.300, blue.400)",
            "linear(to-l, blue.500, blue.400)"
          ),
        }}
      >
        Create Monitor
      </Button>
    </Link>
  );
};
