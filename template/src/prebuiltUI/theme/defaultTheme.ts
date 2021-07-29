/**
 * This file contains the default theme configuration that is imported in _app.tsx.
 * The user should implement a new theme object to make changes to the default theme as they see fit.
 */

import { extendTheme } from "@chakra-ui/react";
import { TopNavBar } from "./components/topNavBar";

const defaultTheme = extendTheme({
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
  components: {
    TopNavBar,
  },
});

export default defaultTheme;
