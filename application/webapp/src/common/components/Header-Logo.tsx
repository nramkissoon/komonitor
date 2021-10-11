import { useColorModeValue } from "@chakra-ui/react";

export function HeaderLogo() {
  const LightModeLogo = <>TODO</>;
  const DarkModeLogo = <>TODO</>;

  return useColorModeValue(LightModeLogo, DarkModeLogo);
}
