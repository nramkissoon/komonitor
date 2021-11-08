import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  Center,
  chakra,
  Flex,
  useColorModeValue,
} from "@chakra-ui/react";
import { FaqPageContent } from "./content";

export function FaqPage() {
  return (
    <Flex overflowX="auto" flexDir="column">
      <Flex mb="5em" flexDir="column" alignItems="center" flex="1">
        <Box>
          <chakra.h1
            textAlign="center"
            fontSize="6xl"
            fontWeight="extrabold"
            color={useColorModeValue("gray.800", "gray.100")}
            lineHeight="shorter"
            mt=".5em"
          >
            Frequently Asked Questions
          </chakra.h1>
        </Box>
      </Flex>
      <Center>
        <Accordion allowMultiple w={["70%"]}>
          {FaqPageContent.map((faq) => (
            <AccordionItem key={faq.question} py="1em">
              <chakra.h2>
                <AccordionButton>
                  <Box
                    flex="1"
                    textAlign="left"
                    fontSize="2xl"
                    fontWeight="bold"
                  >
                    {faq.question}
                  </Box>
                  <AccordionIcon />
                </AccordionButton>
              </chakra.h2>
              <AccordionPanel pb={4} fontSize="xl" fontWeight="normal">
                {faq.answer}
              </AccordionPanel>
            </AccordionItem>
          ))}
        </Accordion>
      </Center>
    </Flex>
  );
}
