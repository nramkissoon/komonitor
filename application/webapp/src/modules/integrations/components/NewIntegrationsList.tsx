import {
  Box,
  Button,
  Flex,
  Grid,
  GridItem,
  useColorModeValue,
} from "@chakra-ui/react";
import Link from "next/link";
import { useSlackInstallUrl } from "../slack/client";
import { SlackSvg } from "./Icons";

const SlackIntegrationButton = () => {
  const { url, isError, isLoading } = useSlackInstallUrl();
  return (
    <Link href={url ? url.url : ""} passHref>
      <Button
        as="a"
        bg="#4A154B"
        color="white"
        w="160px"
        _hover={{ bg: "blue.600" }}
      >
        Add to Slack
      </Button>
    </Link>
  );
};

const IntegrationInfoCard: React.FC<{
  icon: React.ReactElement;
  name: string;
  description: string;
  integrationButton: React.ReactElement;
}> = ({ icon, name, description, integrationButton }) => {
  return (
    <GridItem
      px="10px"
      alignItems="center"
      bg={useColorModeValue("white", "gray.950")}
      py="4"
      w="full"
      rounded="md"
      border="1px"
      borderColor={useColorModeValue("gray.300", "gray.600")}
      transitionDuration=".2s"
      _hover={{
        border: "1px solid",
        borderColor: "blue.300",
      }}
      flexDir={["column", "row"]}
    >
      <Flex alignItems="center" justifyContent="center" flexDir="column">
        {icon}

        <Box fontSize="lg" textAlign="center" my="10px">
          {description}
        </Box>
        {integrationButton}
      </Flex>
    </GridItem>
  );
};

export const NewIntegrationsList = () => {
  return (
    <Grid
      templateColumns={[
        "repeat(1, 1fr)",
        "repeat(2, 1fr)",
        null,
        "repeat(4, 1fr)",
      ]}
      gap={6}
      my="5"
    >
      <IntegrationInfoCard
        name="Slack"
        icon={SlackSvg}
        description="Send alerts directly to your Slack channels."
        integrationButton={<SlackIntegrationButton />}
      />
    </Grid>
  );
};
