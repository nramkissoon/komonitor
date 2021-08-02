/**
 * This file contains the default theme configuration that is imported in _app.tsx.
 * The user should implement a new theme object to make changes to the default theme as they see fit.
 */

import { extendTheme, ThemeConfig } from "@chakra-ui/react";

const colorModeConfig: ThemeConfig = {
  initialColorMode: "light",
};

const defaultTheme = extendTheme({
  config: colorModeConfig,
  styles: {
    global: {
      padding: 0,
      margin: 0,
    },
  },
  fonts: {
    heading: "Roboto",
    body: "Roboto",
  },
});

export default defaultTheme;
