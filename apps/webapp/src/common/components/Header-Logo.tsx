import { Box, Flex, Image, useColorModeValue } from "@chakra-ui/react";

export function HeaderLogo({
  useLightModeValue,
}: {
  useLightModeValue?: boolean;
}) {
  const LightModeLogo = (
    <Flex>
      <Box boxSize="35px" mr=".5em">
        <Image
          src="/logo.svg"
          alt="Komonitor logo"
          height="35px"
          width="35px"
        />
      </Box>
      <Box
        my="auto"
        color="black"
        fontWeight="bold"
        letterSpacing="wide"
        fontSize="lg"
        display={["none", "block"]}
      >
        Komonitor
      </Box>
    </Flex>
  );
  const DarkModeLogo = (
    <Flex>
      <Box boxSize="35px" mr=".5em">
        <Image
          src="/logo.svg"
          alt="Komonitor logo"
          height="35px"
          width="35px"
        />
      </Box>
      <Box
        my="auto"
        color="gray.400"
        fontWeight="bold"
        letterSpacing="wide"
        fontSize="lg"
        display={["none", "block"]}
      >
        Komonitor
      </Box>
    </Flex>
  );
  if (useLightModeValue) return LightModeLogo;
  return useColorModeValue(LightModeLogo, DarkModeLogo);
}
