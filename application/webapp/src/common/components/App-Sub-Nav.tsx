import { Box, Button, Flex, useColorModeValue } from "@chakra-ui/react";
import Link from "next/link";

interface AppLinkProps {
  isSelected: boolean;
  href: string;
  text: string;
}

export const AppNavLink = ({ text, isSelected, href }: AppLinkProps) => {
  return (
    <Box>
      <Link href={href} passHref>
        <Button
          variant="ghost"
          fontWeight="medium"
          letterSpacing="wider"
          px="7"
          fontSize="lg"
          rounded="none"
          color={useColorModeValue("gray.700", "whiteAlpha.800")}
          borderBottom={isSelected ? "1px" : "none"}
          borderColor={useColorModeValue("blue.500", "blue.300")}
        >
          {text}
        </Button>
      </Link>
    </Box>
  );
};

export const AppSubNav = ({ links }: { links: AppLinkProps[] }) => {
  return (
    <Flex
      mb="1em"
      borderBottom="1px"
      borderColor={useColorModeValue("gray.300", "whiteAlpha.300")}
    >
      {links.map((link) => (
        <AppNavLink key={link.href} {...link} />
      ))}
    </Flex>
  );
};
