import { CheckCircleIcon } from "@chakra-ui/icons";
import {
  Box,
  chakra,
  Flex,
  Image,
  SlideFade,
  useColorModeValue,
} from "@chakra-ui/react";
import React, { RefObject } from "react";
import { Copy } from "./constants";

function useFadeInView() {
  const [isVisible, setVisible] = React.useState(true);
  const domRef = React.useRef<Element>();
  React.useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => setVisible(entry.isIntersecting));
    });
    observer.observe(domRef.current!);
    return () => observer.disconnect();
  }, []);

  return {
    domRef,
    isVisible,
  };
}

interface FeatureProps {
  header: string;
  subheader: string;
  list: string[];
  image: string;
  reverse: boolean;
}

function Feature(props: FeatureProps) {
  const { header, subheader, list, image, reverse } = props;
  const { domRef, isVisible } = useFadeInView();

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
    <SlideFade in={isVisible} offsetX={`${reverse ? "-" : ""}200px`}>
      <Flex
        ref={domRef as RefObject<HTMLHeadingElement>}
        mb="4em"
        flexDir={[column, column, column, row as any]}
        alignItems="center"
        bg={useColorModeValue("white", "#0f131a")}
        p="1.5em"
        px="2em"
        shadow="xl"
        borderRadius="xl"
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
          bg={useColorModeValue("gray.700", "white")}
          borderRadius="2xl"
          shadow={"xl"}
          mr={["inherit", null, null, reverse ? "2em" : ""]}
          ml={["inherit", null, null, reverse ? "" : "2em"]}
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
    </SlideFade>
  );
}

export function Features() {
  const { domRef: headerRef, isVisible: headerIsVisible } = useFadeInView();
  return (
    <Flex mb="3em" flexDir="column" alignItems="center">
      <SlideFade in={headerIsVisible} offsetY="40px" delay={0.1}>
        <chakra.h1
          ref={headerRef as RefObject<HTMLHeadingElement>}
          textAlign="center"
          fontSize="5xl"
          fontWeight="extrabold"
          color={useColorModeValue("gray.800", "gray.100")}
          lineHeight="shorter"
          mb=".8em"
        >
          Features
        </chakra.h1>
      </SlideFade>
      {Feature({
        header: Copy.Features.Uptime.Header,
        subheader: Copy.Features.Uptime.Subheader,
        list: Copy.Features.Uptime.List,
        image: "/uptime-dashboard.jpg",
        reverse: false,
      })}
      {Feature({
        header: Copy.Features.Alert.Header,
        subheader: Copy.Features.Alert.Subheader,
        list: Copy.Features.Alert.List,
        image: "/alert-dashboard.jpg",
        reverse: true,
      })}
    </Flex>
  );
}
