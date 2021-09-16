import { Button } from "@chakra-ui/react";
import Link from "next/link";

export const CreateButton = () => {
  return (
    <Link passHref href="/app/uptime/create">
      <Button
        size="lg"
        as="a"
        bgGradient="linear(to-r, blue.400, blue.300)"
        colorScheme="blue"
        fontSize="lg"
        fontWeight="medium"
        color="white"
      >
        Create Monitor
      </Button>
    </Link>
  );
};
