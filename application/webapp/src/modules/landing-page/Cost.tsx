import {
  Box,
  chakra,
  Flex,
  useColorMode,
  useColorModeValue,
} from "@chakra-ui/react";
import React from "react";

const redsDark = [
  "#ffffff",
  "#fef6f6",
  "#fdeded",
  "#fbe3e3",
  "#fadada",
  "#f9d1d1",
  "#f8c8c8",
  "#f6bfbf",
  "#f5b5b5",
  "#f4acac",
  "#f3a3a3",
  "#f19a9a",
  "#f09191",
  "#ef8888",
  "#ee7e7e",
  "#ec7575",
  "#eb6c6c",
  "#ea6363",
  "#e95a5a",
  "#e75050",
  "#e64747",
  "#e53e3e",
];

const redsLight = [
  "#171923",
  "#211b24",
  "#2b1d26",
  "#341e27",
  "#3e2028",
  "#482229",
  "#52242b",
  "#5c252c",
  "#65272d",
  "#6f292f",
  "#792b30",
  "#832c31",
  "#8d2e32",
  "#973034",
  "#a03235",
  "#aa3336",
  "#b43538",
  "#be3739",
  "#c8393a",
  "#d13a3b",
  "#db3c3d",
  "#e53e3e",
];

export const IntersectedBox: React.FC<{
  setState: React.Dispatch<React.SetStateAction<boolean>>;
  currentState: boolean;
  obvProps: IntersectionObserverInit | undefined;
}> = ({ setState, obvProps, currentState, children }) => {
  const domRef = React.useRef<Element>();
  React.useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      const [entry] = entries;

      if (!currentState && entry.isIntersecting) setState(true);
    }, obvProps);
    if (domRef.current) observer.observe(domRef.current!);
    return () => {
      if (domRef.current) observer.unobserve(domRef.current!);
    };
  }, [domRef, obvProps]);

  return (
    <div ref={domRef as any} className="relative">
      {children}
    </div>
  );
};

export const CostSection = () => {
  const [dollar, setDollar] = React.useState(0);
  const [dollarColor, setDollarColor] = React.useState("red.50");
  const [startDollarAnimation, setStartDollarAnimation] = React.useState(false);
  const { colorMode } = useColorMode();

  React.useEffect(() => {
    const interval = setInterval(() => {
      if (dollar < 427 && startDollarAnimation) {
        setDollarColor(
          colorMode === "dark"
            ? redsDark[Math.floor(dollar / 19.4)]
            : redsLight[Math.floor(dollar / 19.4)]
        );
        setDollar(dollar + 1);
      }
    }, 6);
    if (dollar >= 427) {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  });
  return (
    <Flex
      alignItems={"center"}
      justifyContent="center"
      as="section"
      px="20px"
      //mt={["200px", "400px"]}
      w="full"
    >
      <Flex
        //backgroundColor={useColorModeValue("inherit", "gray.700")}
        maxW="6xl"
        rounded={"xl"}
        p={[1, null, "10"]}
        py="6"
        flexDir={["column"]}
      >
        <Flex flexDir={"column"} justifyContent="center" pt="6">
          <chakra.h2
            textAlign="center"
            fontSize={["5xl", "6xl"]}
            fontWeight="extrabold"
            color={useColorModeValue("gray.800", "gray.100")}
            lineHeight="shorter"
            mb=".1em"
          >
            The Cost of Downtime
          </chakra.h2>
          <chakra.h3
            fontSize={["xl", "3xl"]}
            fontWeight="medium"
            textAlign="center"
            lineHeight="shorter"
            w={["80%"]}
            m="auto"
            color={useColorModeValue("gray.600", "gray.400")}
          >
            How much can{" "}
            <span className="underline decoration-red-500 underline-offset-2">
              one minute of downtime
            </span>{" "}
            cost for a small business?
          </chakra.h3>
        </Flex>
        <Flex
          //backgroundColor={useColorModeValue("inherit", "gray.950")}
          w="full"
          rounded={"lg"}
          p={[1, null, "10"]}
          py="6"
          h="fit-content"
          justifyContent="center"
          flexDir={["column"]}
        >
          <IntersectedBox
            obvProps={{ threshold: 0.5, rootMargin: "0px 0px -600px 0px" }}
            setState={setStartDollarAnimation}
            currentState={startDollarAnimation}
          >
            <Box
              fontWeight={"bold"}
              fontSize={["6xl", "8xl"]}
              color={dollarColor}
              textAlign="center"
            >
              ${dollar}
            </Box>
          </IntersectedBox>
          <Box
            fontWeight={"medium"}
            fontSize={["4xl", "6xl"]}
            opacity={dollar === 427 ? 1 : 0}
            transition="all .2s ease-out"
            transitionDelay={"0.3s"}
            textAlign="center"
            mt="-.5em"
          >
            per minute!
          </Box>
          <Box
            fontWeight={"medium"}
            fontSize={["2xl", "4xl"]}
            opacity={dollar === 427 ? 1 : 0}
            transition="all .2s ease-out"
            transitionDelay={"1.3s"}
            textAlign="center"
          >
            +{" "}
            <chakra.span
              fontWeight={"medium"}
              className="underline decoration-red-500 underline-offset-2"
            >
              customer trust
            </chakra.span>
          </Box>
          <Box
            fontWeight={"medium"}
            fontSize={["2xl", "4xl"]}
            opacity={dollar === 427 ? 1 : 0}
            transition="all .2s ease-out"
            transitionDelay={"2.5s"}
            textAlign="center"
          >
            +{" "}
            <chakra.span
              fontWeight={"medium"}
              className="underline decoration-red-500 underline-offset-2"
            >
              time diagnosing the issue
            </chakra.span>
          </Box>
          <Box
            fontWeight={"medium"}
            fontSize={["2xl", "4xl"]}
            opacity={dollar === 427 ? 1 : 0}
            transition="all .2s ease-out"
            transitionDelay={"3.9s"}
            textAlign="center"
          >
            +{" "}
            <chakra.span
              fontWeight={"medium"}
              className="underline decoration-red-500 underline-offset-2"
            >
              peace of mind
            </chakra.span>
          </Box>
          <Box
            fontSize={["2xl", "4xl"]}
            fontWeight="bold"
            textAlign="center"
            lineHeight="shorter"
            w={"full"}
            opacity={dollar === 427 ? 1 : 0}
            transition="all .2s ease-out"
            transitionDelay={"5.5s"}
            m="auto"
            mb="3em"
            mt="1em"
          >
            A monitoring and alerting system saves hundreds.
          </Box>
          <Box
            fontSize={["2xl", "4xl"]}
            fontWeight="bold"
            textAlign="center"
            lineHeight="shorter"
            w={"full"}
            opacity={dollar === 427 ? 1 : 0}
            transition="all .2s ease-out"
            transitionDelay={"7.2s"}
            m="auto"
            mt="1em"
            className=""
          >
            We got you covered...
          </Box>
        </Flex>
      </Flex>
    </Flex>
  );
};
