import {
  Center,
  chakra,
  Flex,
  Image,
  useColorModeValue,
} from "@chakra-ui/react";

export const TeamsSection = () => {
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
        Monitor With Your Team
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
        Invite your team to view and edit monitors and projects.
      </chakra.h3>
      <Center w={["fit-content"]}>
        <Image
          shadow={"xl"}
          borderRadius="3xl"
          alt="Komonitor email team invite"
          src={"/landing/invite-team-notif.png"}
          width="5xl"
        />
      </Center>
    </Flex>
  );
};
