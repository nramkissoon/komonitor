import { extendTheme } from "@chakra-ui/react";
import { mode } from "@chakra-ui/theme-tools";

const config = {
  initialColorMode: "light",
  useSystemColorMode: true,
};

const theme = extendTheme({
  config,
  fonts: {
    heading: "Roboto",
    body: "Roboto",
  },
  styles: {
    global: (props: any) => ({
      body: {
        bg: mode("gray.50", "gray.900")(props),
      },
    }),
  },
  colors: {
    gray: {
      50: "#f5f8fc",
      950: "#0d1014",
    },
  },
});
export default theme;
