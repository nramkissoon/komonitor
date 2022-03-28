import { CheckCircleIcon } from "@chakra-ui/icons";
import { Box, chakra, Flex, Image, useColorModeValue } from "@chakra-ui/react";
import { FadeInView } from "../../common/components/Animation";
import { Copy } from "./constants";

interface FeatureProps {
  header: string;
  subheader: string;
  list: string[];
  image: string;
  reverse: boolean;
}

function Feature(props: FeatureProps) {
  const { header, subheader, list, image, reverse } = props;

  const listElements = list.map((item) => (
    <Box key={item} mb=".5em">
      <CheckCircleIcon color="green.500" mr="10px" />
      <chakra.span fontSize="lg" fontWeight="bold">
        {item}
      </chakra.span>
    </Box>
  ));

  const row = `row${reverse ? "-reverse" : ""}`;
  const column = `column`;

  return (
    <Box w="full" overflowX={"visible"}>
      <Flex
        mt="4em"
        flexDir={[column, column, column, row as any]}
        alignItems="center"
        bg={useColorModeValue("white", "gray.950")}
        p="1.5em"
        px="2em"
        shadow="xl"
        borderRadius="xl"
        maxW={["sm", "xl", "3xl", "6xl", null, "7xl"]}
      >
        <Box w={["inherit", null, null, "3xl"]}>
          <chakra.h2
            textAlign={["center", null, null, "left"]}
            fontSize="3xl"
            fontWeight="extrabold"
          >
            {header}
          </chakra.h2>
          <chakra.h3
            textAlign={["center", null, null, "left"]}
            fontSize="lg"
            fontWeight="bold"
            color="gray.500"
            mb="1em"
          >
            {subheader}
          </chakra.h3>
          {listElements}
        </Box>
        <Box
          bg={useColorModeValue("gray.700", "gray.200")}
          borderRadius="2xl"
          shadow={"xl"}
          mr={["inherit", null, null, reverse ? "2em" : ""]}
          ml={["inherit", null, null, reverse ? "" : "2em"]}
          p="3"
        >
          <Image
            display={["none", null, "inherit"]}
            borderRadius="xl"
            src={image}
            width="1000px"
            css={{
              imageRendering: "-webkit-optimize-contrast",
            }}
            alt={"Komonitor " + header + " dashboard"}
          />
        </Box>
      </Flex>
    </Box>
  );
}

export function Features() {
  return (
    <Flex flexDir="column" alignItems="center" as="section">
      <FadeInView
        obvProps={{ threshold: 0.5, rootMargin: "0px 0px 0px 0px" }}
        inAnimation="motion-safe:animate-scale-fade-in"
        outAnimation="motion-safe:animate-scale-fade-out"
      >
        <chakra.h2
          textAlign="center"
          fontSize="5xl"
          fontWeight="extrabold"
          color={useColorModeValue("gray.800", "gray.100")}
          lineHeight="shorter"
          mb=".1em"
        >
          Modern Monitoring and Instant Alerting
        </chakra.h2>
        <chakra.h3
          fontSize="2xl"
          fontWeight="bold"
          textAlign="center"
          lineHeight="shorter"
          w={["70%"]}
          mx="auto"
          color={useColorModeValue("gray.600", "gray.400")}
        >
          Downtime happens. Know when things go wrong, before your users do.
        </chakra.h3>
      </FadeInView>
      <FadeInView
        obvProps={{ threshold: 0.5, rootMargin: "0px 0px -200px 0px" }}
        inAnimation="motion-safe:animate-slide-fade-in-right"
        outAnimation="motion-safe:animate-slide-fade-out-right"
      >
        {Feature({
          header: Copy.Features.Uptime.Header,
          subheader: Copy.Features.Uptime.Subheader,
          list: Copy.Features.Uptime.List,
          image: "/uptime-dashboard.jpg",
          reverse: false,
        })}
      </FadeInView>
      <FadeInView
        obvProps={{ threshold: 0.5, rootMargin: "0px 0px -200px 0px" }}
        inAnimation="motion-safe:animate-slide-fade-in-left"
        outAnimation="motion-safe:animate-slide-fade-out-left"
      >
        {Feature({
          header: Copy.Features.Customize.Header,
          subheader: Copy.Features.Customize.Subheader,
          list: Copy.Features.Customize.List,
          image: "/cond.png",
          reverse: true,
        })}
      </FadeInView>
      <FadeInView
        obvProps={{ threshold: 0.5, rootMargin: "0px 0px -200px 0px" }}
        inAnimation="motion-safe:animate-slide-fade-in-right"
        outAnimation="motion-safe:animate-slide-fade-out-right"
      >
        {Feature({
          header: Copy.Features.Alert.Header,
          subheader: Copy.Features.Alert.Subheader,
          list: Copy.Features.Alert.List,
          image: "/alert-dashboard.jpg",
          reverse: false,
        })}
      </FadeInView>
    </Flex>
  );
}
