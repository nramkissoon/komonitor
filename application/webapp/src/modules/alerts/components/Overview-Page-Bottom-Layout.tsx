import {
  Box,
  Flex,
  Heading,
  ListItem,
  ScaleFade,
  Textarea,
  UnorderedList,
  useColorModeValue,
} from "@chakra-ui/react";
import React from "react";

interface OverviewPageBottomLayoutProps {
  description: string;
  recipients: string[];
}

export function OverviewPageBottomLayout(props: OverviewPageBottomLayoutProps) {
  const { description, recipients } = props;

  return (
    <ScaleFade in={true} initialScale={0.8}>
      <Flex
        wrap="wrap"
        flexDir={["column", "row"]}
        justifyContent="space-between"
      >
        <Box
          bg={useColorModeValue("white", "#0f131a")}
          shadow="md"
          mb="2em"
          borderRadius="xl"
          py="1.5em"
          w={["100%", "48%"]}
          px="1.5em"
        >
          <Heading fontWeight="medium" fontSize="lg" mb=".2em">
            Description:
          </Heading>
          <Textarea
            value={description}
            contentEditable={false}
            focusBorderColor="none"
            isReadOnly
          />
        </Box>
        <Box
          bg={useColorModeValue("white", "#0f131a")}
          shadow="md"
          mb="2em"
          borderRadius="xl"
          py="1.5em"
          w={["100%", "48%"]}
          px="1.5em"
        >
          <Heading fontWeight="medium" fontSize="lg" mb=".2em">
            Recipients:
          </Heading>
          <UnorderedList spacing={3}>
            {recipients.map((recip) => (
              <ListItem key={recip} letterSpacing="wide">
                {recip}
              </ListItem>
            ))}
          </UnorderedList>
        </Box>
      </Flex>
    </ScaleFade>
  );
}
