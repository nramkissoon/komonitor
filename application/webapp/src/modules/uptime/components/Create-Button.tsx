import { Button } from "@chakra-ui/react";
import Link from "next/link";

export const CreateButton = () => {
  return (
    <Link passHref href="/app/uptime/new">
      <Button
        size="lg"
        as="a"
        fontSize="lg"
        fontWeight="medium"
        px="1em"
        shadow="md"
        colorScheme="blue"
        bgColor="blue.400"
        color="white"
        _hover={{
          bg: "blue.600",
        }}
      >
        + Create a Monitor
      </Button>
    </Link>
  );
};
