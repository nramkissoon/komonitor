import { Box, chakra, Flex, Image, useColorModeValue } from "@chakra-ui/react";
import Link from "next/link";
import { FadeInView } from "../../common/components/Animation";

export const TeamsSection = () => {
  return (
    <Flex flexDir="column" alignItems="center" as="section">
      <FadeInView
        obvProps={{ threshold: 0.5, rootMargin: "0px 0px -100px 0px" }}
        inAnimation="motion-safe:animate-scale-fade-in"
        outAnimation="motion-safe:animate-scale-fade-out"
      >
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
      </FadeInView>
      <Flex
        flexDir={"column"}
        alignItems="center"
        gap={8}
        w={["fit-content"]}
        className="bg-banner"
        backgroundSize={"cover"}
        rounded="2xl"
        p={8}
      >
        <FadeInView
          obvProps={{ threshold: 0.5, rootMargin: "-100px 0px -300px 0px" }}
          inAnimation="motion-safe:animate-notification-fade-in"
          outAnimation="motion-safe:animate-notification-fade-out"
        >
          <Image
            shadow={"xl"}
            borderRadius="3xl"
            alt="Komonitor email team invite"
            src={"/landing/invite-team-notif.png"}
            width="5xl"
          />
        </FadeInView>
        <FadeInView
          obvProps={{ threshold: 0.5, rootMargin: "-100px 0px -300px 0px" }}
          inAnimation="motion-safe:animate-notification-fade-in"
          outAnimation="motion-safe:animate-notification-fade-out"
        >
          <Image
            shadow={"xl"}
            borderRadius="3xl"
            alt="Komonitor email team invite"
            src={"/landing/invite-team-accept.png"}
            width="5xl"
          />
        </FadeInView>
      </Flex>
      <FadeInView
        obvProps={{ threshold: 0.5, rootMargin: "-100px 0px -500px 0px" }}
        inAnimation="motion-safe:animate-scale-fade-in"
        outAnimation="motion-safe:animate-scale-fade-out"
      >
        <Box
          fontSize={["lg", null, "xl"]}
          textAlign="center"
          fontWeight={"medium"}
          mt="15px"
          role="group"
          transitionDuration={".2s"}
          color="blue.500"
          _hover={{
            color: "blue.700",
          }}
        >
          <Link href={"/pricing"}>
            Check out our team plans on the pricing page!
          </Link>
        </Box>
      </FadeInView>
    </Flex>
  );
};
