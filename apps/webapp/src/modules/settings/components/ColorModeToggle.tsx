import { Button } from "@chakra-ui/react";
import { useColorMode, useColorModeValue } from "@chakra-ui/system";
import React from "react";
import { HiMoon, HiSun } from "react-icons/hi";

export function ColorModeToggle() {
  const { toggleColorMode: toggleMode } = useColorMode();
  const colorModeText = useColorModeValue("dark", "light");
  let darkIcon = HiMoon;
  let lightIcon = HiSun;

  let SwitchIcon = useColorModeValue(darkIcon, lightIcon);
  let ButtonText = useColorModeValue("Dark Mode", "Light Mode");

  return (
    <Button
      fontWeight="normal"
      onClick={toggleMode}
      leftIcon={<SwitchIcon />}
      mb="1em"
      shadow="sm"
    >
      {ButtonText}
    </Button>
  );
}
