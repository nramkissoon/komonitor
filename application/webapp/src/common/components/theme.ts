import { extendTheme } from "@chakra-ui/react";
import { mode } from "@chakra-ui/theme-tools";
const theme = extendTheme({
  fonts: {
    heading: "Roboto",
    body: "Roboto",
  },
  styles: {
    global: (props: any) => ({
      body: {
        bg: mode("white", "gray.900")(props),
      },
    }),
  },
});
export default theme;
